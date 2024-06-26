import { useState } from "react";
import { type GetServerSideProps, type GetServerSidePropsContext } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import Divider from "@/components/divider";
import EmailForm from "@/components/forms/emailForm";
import CommercialLayout from "@/components/layouts/commerical/CommercialLayout";
import Metadata from "@/components/metadata";
import TokenForm from "@/components/tokenform";
import { api } from "@/utils/api";
import { auth } from "@modal/auth";
import { motion } from "framer-motion";
import { ZodError, z } from "zod";

import { type NextPageWithLayout } from "./_app";

const Login: NextPageWithLayout = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [token, setToken] = useState("");

  const meta = {
    title: "Modal | Login",
  };

  const variants = {
    hidden: { opacity: 0, x: -200, y: 0 },
    enter: { opacity: 1, x: 0, y: 0 },
    exit: { opacity: 0, x: 0, y: -100 },
  };
  return (
    <>
      <Metadata meta={meta} />
      <motion.article
        variants={variants} // Pass the variant object into Framer Motion
        initial="hidden" // Set the initial state to variants.hidden
        animate="enter" // Animated state to variants.enter
        exit="exit" // Exit state (used later) to variants.exit
        transition={{ type: "linear" }} // Set the transition to linear
        className="mx-auto flex w-full  flex-col items-center justify-center "
      >
        <section className="flex flex-col items-center justify-center px-16">
          <h1 className="text-center text-2xl font-medium md:text-7xl">
            Login
          </h1>
          <h2 className="py-2 text-center text-lg font-light md:py-8 md:text-4xl">
            Welcome back
          </h2>
        </section>
        <section className="flex w-full flex-col items-center space-y-4">
          <div className="my-10 rounded-lg bg-white py-2 shadow-lg md:p-10">
            {!userId ? (
              <LoginEmailForm setUserId={setUserId} />
            ) : (
              <LoginTokenForm otp={token} setOtp={setToken} userId={userId} />
            )}
          </div>
          <div className="px-2 md:w-96">
            <p className="text-sm text-gray-500">
              By continuing with email, you agree to Modal&apos;s{" "}
              <a
                className="underline"
                target="_blank"
                href="https://www.iubenda.com/privacy-policy/92713926"
              >
                Privacy Policy
              </a>{" "}
              and certify you are at least 13 years of age.
            </p>
            <Divider />
            <p className="text-center text-sm text-gray-500">
              Don&apos;t have an acocunt?{" "}
              <Link href="/signup" className="underline">
                Sign up
              </Link>{" "}
            </p>
          </div>
        </section>
      </motion.article>
    </>
  );
};

const LoginEmailForm = ({
  setUserId,
}: {
  setUserId: React.Dispatch<React.SetStateAction<string | null>>;
}) => {
  const { mutate } = api.auth.issueLogin.useMutation({
    onSuccess(data) {
      setUserId(data.userId);
    },
    onError(error) {
      setError(error.message ?? "Something went wrong");
    },
  });
  const [error, setError] = useState<string | null>(null);

  const onSubmit = (formData: { email: string }) => {
    console.log("submitted");

    mutate({ email: formData.email });
  };

  return <EmailForm onSubmit={onSubmit} error={error} />;
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
        destination: "/app",
        permanent: false,
      },
    };
  }
  return {
    props: {},
  };
};

const LoginTokenForm = ({
  otp,
  setOtp,
  userId,
}: {
  otp: string;
  setOtp: React.Dispatch<React.SetStateAction<string>>;
  userId: string;
}) => {
  const router = useRouter();
  const { mutate } = api.auth.validateLogin.useMutation({
    onSuccess() {
      return router.push("/app");
    },
    onError(error) {
      setError(error.message ?? "Something went wrong");
    },
  });
  const [error, setError] = useState<string | null>(null);
  const formSchema = z.object({
    otp: z.string().length(8, "Token too short"),
  });

  const variants = {
    hidden: { opacity: 0, x: 100, y: 0 },
    enter: { opacity: 1, x: 0, y: 0 },
    exit: { opacity: 0, x: 0, y: -100 },
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      formSchema.parse({ otp });
      mutate({ userProvidedToken: otp, userId });
    } catch (error) {
      if (error instanceof ZodError) {
        setError(error.issues[0]?.message ?? "Something went wrong");
      } else if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Something went wrong");
      }
    }
  };

  return (
    <motion.div
      variants={variants} // Pass the variant object into Framer Motion
      initial="hidden" // Set the initial state to variants.hidden
      animate="enter" // Animated state to variants.enter
      exit="exit" // Exit state (used later) to variants.exit
      transition={{ type: "linear" }} // Set the transition to linear
      className="flex flex-col items-center space-y-8 "
    >
      <TokenForm
        setError={setError}
        error={error}
        onSubmit={onSubmit}
        otp={otp}
        setOtp={setOtp}
      />
    </motion.div>
  );
};

Login.getLayout = (page) => <CommercialLayout>{page}</CommercialLayout>;

export default Login;
