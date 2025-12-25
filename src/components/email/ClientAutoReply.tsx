import {
    Body,
    Container,
    Head,
    Heading,
    Html,
    Preview,
    Section,
    Text,
    Button,
} from "@react-email/components";
import * as React from "react";

interface ClientAutoReplyProps {
    name: string;
}

export const ClientAutoReply = ({
    name,
}: ClientAutoReplyProps) => {
    const firstName = name ? name.split(' ')[0] : 'there';
    const previewText = `We've received your inquiry - Bravild`;

    return (
        <Html>
            <Head />
            <Preview>{previewText}</Preview>
            <Body style={main}>
                <Container style={container}>
                    {/* Header */}
                    <Section style={{ marginTop: '10px', marginBottom: '40px', textAlign: 'center' }}>
                        <Heading style={logo}>BRAVILD</Heading>
                        <Text style={subLogo}>DIGITAL AGENCY</Text>
                    </Section>

                    {/* Content */}
                    <Section style={contentBox}>
                        <div style={{ marginBottom: '24px', textAlign: 'center' }}>
                            <div style={iconCircle}>
                                <span style={{ fontSize: '24px' }}>✨</span>
                            </div>
                        </div>

                        <Heading style={greeting}>Thank you, {firstName}.</Heading>

                        <Text style={paragraph}>
                            We have received your project inquiry. We appreciate you reaching out to us.
                        </Text>

                        <Text style={paragraphSecondary}>
                            Our team is currently reviewing your details. We typically respond within 24 hours to schedule a discovery call.
                        </Text>

                        <Button
                            style={button}
                            href="https://bravild.in/#work"
                        >
                            View Our Work
                        </Button>
                    </Section>

                    {/* Footer */}
                    <Section style={footer}>
                        <Text style={footerText}>
                            Bravild Digital Agency<br />
                            Mumbai, India
                        </Text>
                        <Text style={copyright}>
                            © 2024 Bravild. All rights reserved.
                        </Text>
                    </Section>
                </Container>
            </Body>
        </Html>
    );
};

// Styles
const main = {
    backgroundColor: '#000000',
    fontFamily: 'Helvetica, Arial, sans-serif',
    margin: '0 auto',
    padding: '40px 0',
};

const container = {
    border: '1px solid #333',
    borderRadius: '8px',
    margin: '0 auto',
    padding: '40px',
    maxWidth: '600px',
    backgroundColor: '#0a0a0a',
};

const logo = {
    color: '#ffffff',
    fontSize: '32px',
    fontWeight: 'bold',
    letterSpacing: '0.2em',
    margin: '0',
    textTransform: 'uppercase' as const,
};

const subLogo = {
    color: '#666666',
    fontSize: '10px',
    letterSpacing: '0.4em',
    textTransform: 'uppercase' as const,
    marginTop: '8px',
};

const contentBox = {
    backgroundColor: '#111111',
    borderRadius: '8px',
    padding: '40px',
    border: '1px solid #222',
    textAlign: 'center' as const,
};

const iconCircle = {
    backgroundColor: '#222',
    borderRadius: '50%',
    width: '64px',
    height: '64px',
    display: 'inline-block', // Changed for email compatibility
    textAlign: 'center' as const,
    margin: '0 auto',
    border: '1px solid #333',
    lineHeight: '64px',
};

const greeting = {
    color: '#ffffff',
    fontSize: '24px',
    fontWeight: '500',
    marginBottom: '16px',
};

const paragraph = {
    color: '#cccccc',
    fontSize: '16px',
    lineHeight: '28px',
    marginBottom: '24px',
};

const paragraphSecondary = {
    color: '#888888',
    fontSize: '14px',
    lineHeight: '24px',
    marginBottom: '32px',
    padding: '0 16px',
};

const button = {
    backgroundColor: '#ffffff',
    color: '#000000',
    borderRadius: '9999px',
    padding: '16px 32px',
    fontWeight: 'bold',
    fontSize: '12px',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.1em',
    textDecoration: 'none',
    display: 'inline-block',
};

const footer = {
    marginTop: '40px',
    textAlign: 'center' as const,
    borderTop: '1px solid #222',
    paddingTop: '32px',
};

const footerText = {
    color: '#444444',
    fontSize: '12px',
    lineHeight: '20px',
    marginBottom: '16px',
};

const copyright = {
    color: '#333333',
    fontSize: '10px',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.1em',
};

export default ClientAutoReply;
