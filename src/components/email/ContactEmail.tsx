import {
    Body,
    Container,
    Head,
    Heading,
    Hr,
    Html,
    Preview,
    Section,
    Text,
    Tailwind,
    Row,
    Column,
} from "@react-email/components";
import * as React from "react";

interface ContactEmailProps {
    name: string;
    email: string;
    message: string;
}

export const ContactEmail = ({
    name,
    email,
    message,
}: ContactEmailProps) => {
    const previewText = `New Project Inquiry from ${name}`;

    return (
        <Html>
            <Head />
            <Preview>{previewText}</Preview>
            <Tailwind>
                <Body className="bg-black my-auto mx-auto font-sans text-white">
                    <Container className="border border-solid border-[#333] rounded-lg my-[40px] mx-auto p-[40px] max-w-[600px] shadow-2xl bg-[#0a0a0a]">
                        {/* Header */}
                        <Section className="mt-[10px] mb-[40px]">
                            <Heading className="text-white text-[32px] font-bold tracking-[0.2em] text-center p-0 m-0 uppercase font-sans">
                                Bravild
                            </Heading>
                            <Text className="text-[#666] text-[12px] tracking-[0.4em] text-center uppercase mt-2">
                                Digital Agency
                            </Text>
                        </Section>

                        {/* Badge */}
                        <Section className="text-center mb-[40px]">
                            <div className="inline-block bg-[#222] border border-[#333] rounded-full px-6 py-2">
                                <Text className="text-[#fff] text-[12px] font-medium tracking-wider uppercase m-0">
                                    New Project Inquiry
                                </Text>
                            </div>
                        </Section>

                        {/* Content */}
                        <Section className="bg-[#111] rounded-lg p-8 border border-[#222]">
                            <Row className="mb-6">
                                <Column>
                                    <Text className="text-[#666] text-[10px] uppercase tracking-[0.2em] font-bold mb-2">
                                        Client Name
                                    </Text>
                                    <Text className="text-white text-[18px] font-medium m-0">
                                        {name}
                                    </Text>
                                </Column>
                            </Row>

                            <Row className="mb-8">
                                <Column>
                                    <Text className="text-[#666] text-[10px] uppercase tracking-[0.2em] font-bold mb-2">
                                        Email Address
                                    </Text>
                                    <Text className="text-white text-[18px] font-medium m-0">
                                        {email}
                                    </Text>
                                </Column>
                            </Row>

                            <Hr className="border border-solid border-[#333] my-[20px] mx-0 w-full" />

                            <Row>
                                <Column>
                                    <Text className="text-[#666] text-[10px] uppercase tracking-[0.2em] font-bold mb-4">
                                        Project Details
                                    </Text>
                                    <Text className="text-[#ddd] text-[16px] leading-[28px] m-0 whitespace-pre-wrap font-light">
                                        {message}
                                    </Text>
                                </Column>
                            </Row>
                        </Section>

                        {/* Footer */}
                        <Section className="mt-[40px] text-center">
                            <Text className="text-[#444] text-[12px] leading-[24px]">
                                This email was sent from your portfolio website contact form.
                            </Text>
                            <Text className="text-[#333] text-[12px] mt-4 uppercase tracking-widest">
                                © 2024 Bravild Agency
                            </Text>
                        </Section>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
};

export default ContactEmail;
