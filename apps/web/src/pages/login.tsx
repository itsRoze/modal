import { useState } from "react";
import CommercialLayout from "@/components/layouts/commerical/CommercialLayout";
import { Button } from "@/components/ui/button";

import { type NextPageWithLayout } from "./_app";

type ResponseData = {
  token: string;
  userId: string;
};
const Login: NextPageWithLayout = () => {
  const [userId, setUserId] = useState<string | null>(null);

  const onIssue = async () => {
    const response = await fetch("/api/auth/login/issue", {
      method: "POST",
      body: JSON.stringify({ email: "example@email.com" }),
    });

    const data = (await response.json()) as ResponseData;
    setUserId(data.userId);
  };

  const onValidate = async () => {
    await fetch("/api/auth/login/validate", {
      method: "POST",
      body: JSON.stringify({ token: "33884488", userId }),
    });
  };

  return (
    <article>
      <Button onClick={onIssue}>Issue</Button>
      <Button onClick={onValidate}>Validate</Button>
    </article>
  );
};

Login.getLayout = (page) => <CommercialLayout>{page}</CommercialLayout>;

export default Login;
