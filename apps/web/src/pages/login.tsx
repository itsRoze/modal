import { useState } from "react";
import { type GetServerSideProps, type GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import EmailForm from "@/components/forms/emailForm";
import CommercialLayout from "@/components/layouts/commerical/CommercialLayout";
import TokenForm from "@/components/tokenform";
import { auth } from "@modal/auth";
import { motion } from "framer-motion";
import { ZodError, z } from "zod";

import { type NextPageWithLayout } from "./_app";

const Login: NextPageWithLayout = () => {
  const [userId, setUserId] = useState<string | null>(null);
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
      className="bg-blur-login mx-auto flex  flex-col items-center justify-center bg-cover bg-fixed bg-no-repeat"
    >
      <section className="flex flex-col items-center space-y-4 rounded-lg bg-white py-2 shadow-lg md:p-10">
        {!userId ? (
          <LoginEmailForm setUserId={setUserId} />
        ) : (
          <LoginTokenForm otp={token} setOtp={setToken} userId={userId} />
        )}
      </section>
    </motion.article>
  );
};

type ResponseData = {
  userId?: string;
  error?: string;
};

const LoginEmailForm = ({
  setUserId,
}: {
  setUserId: React.Dispatch<React.SetStateAction<string | null>>;
}) => {
  const [error, setError] = useState<string | null>(null);

  const formSchema = z.object({
    email: z.string().email(),
  });

  type FormInput = z.infer<typeof formSchema>;

  const onSubmit = async (formData: FormInput) => {
    try {
      const response = await fetch("/api/auth/login/issue", {
        method: "POST",
        body: JSON.stringify({ email: formData.email }),
      });

      const data = (await response.json()) as ResponseData;
      if (!data.userId) throw new Error(data.error ?? "Something went wrong");
      setUserId(data.userId);
    } catch (error) {
      if (error instanceof Error) setError(error.message);
      else setError("Something went wrong");
    }
  };

  return <EmailForm onSubmit={onSubmit} error={error} />;
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
      const response = await fetch("/api/auth/login/validate", {
        method: "POST",
        body: JSON.stringify({ token: otp, userId }),
      });
      if (response.redirected) return router.push(response.url);

      const data = (await response.json()) as {
        error: string;
      };

      throw new Error(data.error ?? "Something went wrong");
    } catch (error) {
      if (error instanceof ZodError) {
        setError(error.message);
      }
      console.log(error);
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

Login.getLayout = (page) => <CommercialLayout>{page}</CommercialLayout>;

export default Login;
