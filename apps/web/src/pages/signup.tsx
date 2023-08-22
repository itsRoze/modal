import { useState } from "react";
import { type GetServerSideProps, type GetServerSidePropsContext } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import Divider from "@/components/divider";
import EmailForm from "@/components/forms/emailForm";
import CommercialLayout from "@/components/layouts/commerical/CommercialLayout";
import TokenForm from "@/components/tokenform";
import { anybody } from "@/utils/fonts";
import { auth } from "@modal/auth";
import { motion } from "framer-motion";
import { ZodError, z } from "zod";

import { type NextPageWithLayout } from "./_app";

const SignUp: NextPageWithLayout = () => {
  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState("");
  const [token, setToken] = useState("");

  const variants = {
    hidden: { opacity: 0, x: -200, y: 0 },
    enter: { opacity: 1, x: 0, y: 0 },
    exit: { opacity: 0, x: 0, y: -100 },
  };

  return (
    <motion.article
      variants={variants} // Pass the variant object into Framer Motion
      initial="hidden" // Set the initial state to variants.hidden
      animate="enter" // Animated state to variants.enter
      exit="exit" // Exit state (used later) to variants.exit
      transition={{ type: "linear" }} // Set the transition to linear
      className={`${anybody.variable} mx-auto w-full font-mono`}
    >
      <section className="flex flex-col items-center justify-center px-16">
        <h1 className="text-center text-2xl font-medium md:text-7xl">
          Start with a 2 week free trial
        </h1>
        <h2 className="py-2 text-center text-lg font-light md:py-8 md:text-4xl">
          No credit card required
        </h2>
      </section>
      <section className="flex flex-col items-center space-y-4">
        <div className="my-10 rounded-lg bg-white py-2 shadow-lg md:p-10">
          {!userId || !email ? (
            <SignupEmailForm setUserId={setUserId} setEmail={setEmail} />
          ) : (
            <SignupTokenForm userId={userId} otp={token} setOtp={setToken} />
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
            Already signed up?{" "}
            <Link href="/login" className="underline">
              Go to login
            </Link>{" "}
          </p>
        </div>
      </section>
    </motion.article>
  );
};

type ResponseData = {
  userId?: string;
  email?: string;
  error?: string;
};

interface IEmailFrom {
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  setUserId: React.Dispatch<React.SetStateAction<string>>;
}
const SignupEmailForm: React.FC<IEmailFrom> = ({ setEmail, setUserId }) => {
  const [error, setError] = useState<string | null>(null);

  const formSchema = z.object({
    email: z.string().email(),
  });

  type FormInput = z.infer<typeof formSchema>;

  const onSubmit = async (values: FormInput) => {
    try {
      const response = await fetch("/api/auth/signup/issue", {
        method: "POST",
        body: JSON.stringify({ email: values.email }),
      });

      const data = (await response.json()) as ResponseData;
      if (data.error) throw new Error(data.error);
      setEmail(values.email);
      if (data.userId) setUserId(data.userId);
    } catch (error) {
      if (error instanceof Error) setError(error.message);
      else setError("Something went wrong");
    }
  };

  return (
    <EmailForm
      onSubmit={onSubmit}
      error={error}
      label="Just enter your email"
    />
  );
};

const SignupTokenForm = ({
  otp,
  setOtp,
  userId,
}: {
  otp: string;
  setOtp: React.Dispatch<React.SetStateAction<string>>;
  userId: string;
}) => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const formSchema = z.object({
    otp: z.string().length(8),
  });

  const variants = {
    hidden: { opacity: 0, x: 100, y: 0 },
    enter: { opacity: 1, x: 0, y: 0 },
    exit: { opacity: 0, x: 0, y: -100 },
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      formSchema.parse({ otp });
      const response = await fetch("/api/auth/signup/validate", {
        method: "POST",
        body: JSON.stringify({ userProvidedToken: otp, userId }),
      });
      if (response.redirected) return router.push(response.url);

      const data = (await response.json()) as {
        error: string;
      };

      throw new Error(data.error ?? "Something went wrong");
    } catch (error) {
      if (error instanceof ZodError) {
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
      className="flex min-w-fit flex-col items-center space-y-8 "
    >
      <TokenForm
        onSubmit={onSubmit}
        setOtp={setOtp}
        otp={otp}
        error={error}
        setError={setError}
      />
    </motion.div>
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
        destination: "/app",
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
