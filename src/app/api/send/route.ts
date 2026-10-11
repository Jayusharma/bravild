import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import ContactEmail from '@/components/email/ContactEmail';
import ClientAutoReply from '@/components/email/ClientAutoReply';
import { render } from '@react-email/render';

const ADMIN_EMAIL = 'connect@bravild.in';
const FROM = 'Bravild <enquiry@bravild.in>';

// Best-effort per-IP limiter. On serverless each instance has its own memory,
// so this only blunts casual abuse; it is not a hard guarantee.
const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 5;
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
    const now = Date.now();
    const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
    if (recent.length >= MAX_REQUESTS) {
        hits.set(ip, recent);
        return true;
    }
    recent.push(now);
    hits.set(ip, recent);
    // keep the map from growing without bound
    if (hits.size > 500) {
        for (const [key, times] of hits) {
            if (times.every((t) => now - t >= WINDOW_MS)) hits.delete(key);
        }
    }
    return false;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const clean = (v: unknown) => (typeof v === 'string' ? v.trim() : '');

export async function POST(request: Request) {
    try {
        const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'unknown';
        if (rateLimited(ip)) {
            return NextResponse.json(
                { error: 'Too many requests. Please try again in a few minutes.' },
                { status: 429 }
            );
        }

        let body: unknown;
        try {
            body = await request.json();
        } catch {
            return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
        }
        if (!body || typeof body !== 'object') {
            return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
        }
        const data = body as Record<string, unknown>;

        // Honeypot: real visitors never fill this hidden field. Pretend success.
        if (clean(data.website)) {
            return NextResponse.json({ success: true });
        }

        const name = clean(data.name);
        const email = clean(data.email);
        const message = clean(data.message);

        if (!name || name.length > 100) {
            return NextResponse.json({ error: 'Please enter your name.' }, { status: 400 });
        }
        if (!email || email.length > 254 || !EMAIL_RE.test(email)) {
            return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
        }
        if (!message || message.length > 5000) {
            return NextResponse.json({ error: 'Please enter a message (up to 5000 characters).' }, { status: 400 });
        }

        const apiKey = process.env.RESEND_API_KEY;
        if (!apiKey) {
            console.error('RESEND_API_KEY is not configured');
            return NextResponse.json({ error: 'Email service is not configured.' }, { status: 500 });
        }
        const resend = new Resend(apiKey);

        const adminEmailHtml = await render(ContactEmail({ name, email, message }));
        const clientEmailHtml = await render(ClientAutoReply({ name }));

        // Header-safe subject (no line breaks, bounded length)
        const subjectName = name.replace(/[\r\n]+/g, ' ').slice(0, 80);

        // allSettled so a failed auto-reply never blocks the admin email
        const [adminResult, clientResult] = await Promise.allSettled([
            resend.emails.send({
                from: FROM,
                to: [ADMIN_EMAIL],
                replyTo: email,
                subject: `New Inquiry: ${subjectName}`,
                html: adminEmailHtml,
            }),
            resend.emails.send({
                from: FROM,
                to: [email],
                subject: 'We received your inquiry - Bravild',
                html: clientEmailHtml,
            }),
        ]);

        const adminFailed =
            adminResult.status === 'rejected' ||
            (adminResult.status === 'fulfilled' && adminResult.value.error);
        if (adminFailed) {
            console.error(
                'Admin email failed:',
                adminResult.status === 'rejected' ? adminResult.reason : adminResult.value.error
            );
            return NextResponse.json(
                { error: 'Could not send your message. Please email connect@bravild.in directly.' },
                { status: 500 }
            );
        }

        if (
            clientResult.status === 'rejected' ||
            (clientResult.status === 'fulfilled' && clientResult.value.error)
        ) {
            // Non-critical: the enquiry reached us
            console.warn(
                'Auto-reply failed:',
                clientResult.status === 'rejected' ? clientResult.reason : clientResult.value.error
            );
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Server error in /api/send:', error);
        return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
    }
}
