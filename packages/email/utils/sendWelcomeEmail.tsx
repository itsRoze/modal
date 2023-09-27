import { Resend } from "resend";
import { Config } from "sst/node/config";

import { WelcomeEmail } from "../emails/welcome";

interface SendWelcomeEmailProps {
  userEmail: string;
  fromEmail: string;
}

export const sendWelcomeEmail = async ({
  userEmail,
  fromEmail,
}: SendWelcomeEmailProps) => {
  const resend = new Resend(Config.RESEND_API_KEY);

  try {
    const data = await resend.sendEmail({
      from: fromEmail,
      to: userEmail,
      subject: "Welcome to Modal",
      react: <WelcomeEmail />,
    });

    return data;
  } catch (error) {}
};
