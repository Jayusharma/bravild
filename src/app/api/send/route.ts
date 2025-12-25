import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import ContactEmail from '@/components/email/ContactEmail';
import ClientAutoReply from '@/components/email/ClientAutoReply';
import { render } from '@react-email/render';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
    try {
        const { name, email, message } = await request.json();

        console.log("Attempting to send emails...");

        // 1. Render Templates
        const adminEmailHtml = await render(ContactEmail({ name, email, message }));
        const clientEmailHtml = await render(ClientAutoReply({ name }));

        // 2. Send Emails
        // 2. Send Emails
        // We use Promise.allSettled to ensure one failure doesn't stop the other
        const results = await Promise.allSettled([
            // Email to Admin (You)
            resend.emails.send({
                from: 'Bravild <enquiry@bravild.in>',
                to: ['connect@bravild.in'],
                subject: `New Inquiry: ${name}`,
                html: adminEmailHtml
            }),
            // Email to Client (Auto-reply)
            resend.emails.send({
                from: 'Bravild <enquiry@bravild.in>',
                to: [email],
                subject: 'We received your inquiry - Bravild',
                html: clientEmailHtml,
            })
        ]);

        // Log results
        const [adminResult, clientResult] = results;
        console.log("Admin Email Result:", adminResult);
        console.log("Client Email Result:", clientResult);

        // Check if Admin email failed (Critical)
        if (adminResult.status === 'rejected' || (adminResult.status === 'fulfilled' && adminResult.value.error)) {
            console.error("Failed to send admin email");
            const error = adminResult.status === 'rejected' ? adminResult.reason : adminResult.value.error;
            return NextResponse.json({ error }, { status: 500 });
        }

        // Return success even if client email fails (likely due to unverified domain in testing)
        return NextResponse.json({ success: true });

    } catch (error) {
        console.error("Server Error:", error);
        return NextResponse.json({ error }, { status: 500 });
    }
}
