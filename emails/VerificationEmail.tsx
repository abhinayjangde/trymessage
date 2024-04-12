import * as React from 'react';
import {
    Html,
    Head,
    Font,
    Button,
    Preview,
    Heading,
    Row,
    Section,
    Text
} from '@react-email/components';


interface VerificationEmailProps {
    username: string
    otp: string
}
const VerificationEmail = ({ username, otp }: VerificationEmailProps) => {

    return (
        <Html lang="en" dir='ltr'>
            <Head>
                <title>Verification Code</title>
                <Font
                    fontFamily={"Roboto"}
                    fallbackFontFamily={"Verdana"}
                    webFont={{ url: "", format: 'woff2' }}
                    fontWeight={400}
                    fontStyle='normal'
                />
            </Head>
            <Preview>Here&apos;s your verification code : {otp}</Preview>
            <Section>
                <Row>
                    <Heading as='h2' >Hello {username},</Heading>
                </Row>
                <Row>
                    <Text>
                        Thank for your registering. Please use the following verification code to comlete your registeraion:
                    </Text>
                </Row>
                <Row>
                    <Text>{otp}</Text>
                </Row>
                <Row>
                    <Text>If you did not request this code, please ignore this email.</Text>
                </Row>
            </Section>
        </Html>
    );
}

export default VerificationEmail;
