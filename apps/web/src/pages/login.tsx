import { useState } from "react";
import { type GetServerSideProps, type GetServerSidePropsContext } from "next";
import EmailForm from "@/components/forms/emailForm";
import CommercialLayout from "@/components/layouts/commerical/CommercialLayout";
import { auth } from "@modal/auth";
import { motion } from "framer-motion";

import { type NextPageWithLayout } from "./_app";

const Login: NextPageWithLayout = () => {
  const [userId, setUserId] = useState<string | null>(null);

  const onSubmit = async (formData: { email: string }) => {
    console.log("SUBMIT", formData.email);
    try {
      const response = await fetch("/api/auth/login/issue", {
        method: "POST",
        body: JSON.stringify({ email: formData.email }),
      });

      const data = await response.text();
      console.log("RES DATA", data);

      if (!response.ok) {
        throw new Error(data ?? "Something went wrong");
      }
    } catch (error) {
      console.error(error);
    }
  };

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
      className="mx-auto flex w-full  flex-col items-center justify-center "
    >
      <section className="flex flex-col items-center justify-center px-16">
        <h1 className="text-center text-2xl font-medium md:text-7xl">Login</h1>
        <h2 className="py-2 text-center text-lg font-light md:py-8 md:text-4xl">
          Welcome back
        </h2>
      </section>
      <section className="flex w-full flex-col items-center space-y-4">
        <div className="my-10 rounded-lg bg-white py-2 shadow-lg md:p-10">
          {!userId ? <EmailForm onSubmit={onSubmit} /> : null}
        </div>
      </section>
    </motion.article>
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
