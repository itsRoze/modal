import * as React from "react";
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

const logoUrl =
  process.env.NODE_ENV === "production"
    ? `https://usemodal.com/images/Logo.png`
    : "/static/Logo.png";

export const WelcomeEmail = () => {
  return (
    <Html>
      <Head />
      <Tailwind>
        <Body style={main} className="bg-gray-100">
          <Img
            src={logoUrl}
            width="1025"
            height="237"
            alt="Modal logo"
            style={logo}
          />
          <Container style={container}>
            <Heading className="text-center text-5xl font-light">
              Welcome
            </Heading>
            <Section className="px-2">
              <Text className="text-lg text-gray-500">
                Well hello, friend 👋. Welcome to Modal! I&apos;m thrilled to
                have you on board.
              </Text>
              <Text className="text-lg text-gray-500">
                My name is Roze, I built Modal, and I&apos;m <em>dedicated</em>{" "}
                to making sure this is a <b>fantastic experience for you</b> 😇.
              </Text>
              <Text className="text-lg text-gray-500">
                To kick things off, why not schedule a quick tour with me? I can
                answer questions and gather any feedback you may have! This is a
                great way for you to get started and your insights will help me
                continue to improve this app.
              </Text>
              <Button
                href="https://cal.com/itsroze/modal-tour"
                className="mx-auto my-0 block w-1/4 rounded-lg bg-orange-400 p-2 text-center font-semibold text-gray-700"
              >
                Schedule a Tour
              </Button>
              <Text className="text-center text-sm italic text-gray-500">
                If the button above doesn&apos;t work, you can copy this URL
                into your browser: https://cal.com/itsroze/modal-tour
              </Text>
              <Text className="text-lg text-gray-500">
                If you have any immediate questions or need assistance, feel
                free to reach out anytime at{" "}
                <Link href="mailto:contact@codestache.com?subject=Modal App - Feedback">
                  contact@codestache.com
                </Link>
              </Text>
              <Text className="text-lg text-gray-500">
                And with that, enjoy the app!
              </Text>
              <Text className="float-right text-lg italic text-gray-500">
                &mdash;Roze
              </Text>
            </Section>
          </Container>
          <Text style={footer}>Sent by Modal</Text>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default WelcomeEmail;

const main = {
  fontFamily: "HelveticaNeue,Helvetica,Arial,sans-serif",
};

const container = {
  backgroundColor: "#ffffff",
  border: "1px solid #eee",
  borderRadius: "5px",
  boxShadow: "0 5px 10px rgba(20,50,70,.2)",
  width: "50%",
  margin: "0 auto",
  padding: "0 0 130px",
};

const logo = {
  margin: "0 auto",
  width: "10%",
  height: "auto",
  marginBottom: "20px",
};

const footer = {
  color: "#000",
  fontSize: "12px",
  fontWeight: 800,
  letterSpacing: "0",
  lineHeight: "23px",
  margin: "0",
  marginTop: "20px",
  fontFamily: "HelveticaNeue,Helvetica,Arial,sans-serif",
  textAlign: "center" as const,
  textTransform: "uppercase" as const,
};
