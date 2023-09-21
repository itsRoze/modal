import * as React from "react";
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Img,
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
                Well hello, friend 👋. I&apos;m so glad you&apos;ve decided to
                use Modal.
              </Text>
              <Text className="text-lg text-gray-500">
                My name is Roze, I built Modal, and I&apos;m <em>dedicated</em>{" "}
                to making sure this is a <b>great experience for you</b> 😇.
              </Text>
              <Text className="text-lg text-gray-500">
                If you want to a quick tour of Modal, you can schedule a block
                of time with me. I can answer any questions you have and take
                any feedback you may have! This is a great way for you to get
                started and it also helps me understand how I can continue to
                enhance this app.
              </Text>
            </Section>
            <Section className="relative mx-auto my-0 inline-block w-full px-2">
              <Button
                href="https://example.com"
                className="mx-auto my-0 block rounded-lg bg-orange-400 p-2 text-center font-semibold text-gray-700"
              >
                Schedule a Tour
              </Button>
            </Section>
            <Section className="px-2">
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
