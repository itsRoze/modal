import { type GetServerSideProps, type GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import CommercialLayout from "@/components/layouts/commerical/CommercialLayout";
import { auth } from "@modal/auth";

import { type NextPageWithLayout } from "./_app";

const SignUp: NextPageWithLayout = () => {
  const router = useRouter();
  const onSubmit = async () => {
    const response = await fetch("/api/auth/signup", {
      method: "POST",
      body: JSON.stringify({ email: "example@email.com" }),
    });

    if (response.redirected) return router.push("/");

    const result = (await response.json()) as {
      error: string;
    };

    console.log(result.error);
  };

  return (
    <article>
      <button onClick={onSubmit}>Sign up</button>
    </article>
  );
};

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext,
) => {
  const { req, res } = context;
  const authRequest = auth.handleRequest(req, res);
  const session = await authRequest.validate();

  if (session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  return {
    props: {},
  };
};

SignUp.getLayout = (page) => <CommercialLayout>{page}</CommercialLayout>;
export default SignUp;
