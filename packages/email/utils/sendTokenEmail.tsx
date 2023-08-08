import * as Sentry from "@sentry/node";
import { Resend } from "resend";
import { Config } from "sst/node/config";

import { TokenCodeEmail } from "../emails/token-code";

interface SendTokenEmailProps {
  userEmail: string;
  fromEmail: string;
  token: string;
}

export const sendTokenEmail = async ({
  userEmail,
  fromEmail,
  token,
}: SendTokenEmailProps) => {
  const resend = new Resend(Config.RESEND_API_KEY);

  try {
    const data = await resend.sendEmail({
      from: fromEmail,
      to: userEmail,
      subject: "Modal | Verification Code",
      react: <TokenCodeEmail tokenCode={token} />,
    });

    return data;
  } catch (error) {
    Sentry.captureException(error);
  }
};
