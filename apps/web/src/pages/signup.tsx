import { useState } from "react";
import { type GetServerSideProps, type GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import CommercialLayout from "@/components/layouts/commerical/CommercialLayout";
import OtpInput from "@/components/otp";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { anybody } from "@/utils/fonts";
import { zodResolver } from "@hookform/resolvers/zod";
import { auth } from "@modal/auth";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
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

  const formVariants = {
    hidden: { opacity: 0, x: 100, y: 0 },
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
      className={`${anybody.variable} font-mono`}
    >
      <section className="flex flex-col items-center justify-center px-16">
        <h1 className="text-center text-2xl font-medium md:text-7xl">
          Start with a 7 day free trial
        </h1>
        <h2 className="py-2 text-center text-lg font-light md:py-8 md:text-4xl">
          No credit card required
        </h2>
      </section>
      <section className="mt-10 flex justify-center md:mt-5">
        <div className="relative mx-4 w-full md:mx-0 md:w-1/2">
          <div className="border-logo relative flex flex-col items-center space-y-12 rounded-lg border p-4 shadow-xl md:p-12">
            <motion.div
              variants={formVariants} // Pass the variant object into Framer Motion
              initial="hidden" // Set the initial state to variants.hidden
              animate="enter" // Animated state to variants.enter
              exit="exit" // Exit state (used later) to variants.exit
              transition={{ type: "linear" }} // Set the transition to linear
              className="flex w-full items-center justify-center"
            >
              {userId || email ? (
                <EmailForm />
              ) : (
                <TokenForm userId={userId} otp={token} setOtp={setToken} />
              )}
            </motion.div>
          </div>
        </div>
      </section>
    </motion.article>
  );
};

const EmailForm = () => {
  const [error, setError] = useState<string | null>(null);

  const formSchema = z.object({
    email: z.string().email(),
  });

  type FormInput = z.infer<typeof formSchema>;

  const form = useForm<FormInput>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: FormInput) => {
    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        body: JSON.stringify({ email: values.email }),
      });
    } catch (error) {
      console.log(error);
      setError("Something went wrong");
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex w-full flex-col items-center space-y-4"
      >
        <FormField
          name="email"
          control={form.control}
          render={({ field }) => (
            <FormItem className="w-full md:w-fit">
              <FormLabel htmlFor="email">Email</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="email"
                  placeholder="tim@email.com"
                  className="w-full text-gray-500 md:w-80"
                />
              </FormControl>
            </FormItem>
          )}
        />
        {error || form.formState.errors ? (
          <p className="text-destructive text-sm font-medium">
            {error ?? form.formState.errors.email?.message}
          </p>
        ) : null}

        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.8 }}
          className="w-fit rounded-lg shadow-xl "
        >
          <Button className="bg-logo hover:bg-orange-300">Submit</Button>
        </motion.div>
      </form>
    </Form>
  );
};

const TokenForm = ({
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

  const onChange = (value: string) => {
    setError(null);
    setOtp(value);
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      formSchema.parse({ otp });
      const response = await fetch("/api/auth/signup/validate", {
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
    <form
      onSubmit={onSubmit}
      className="flex w-full min-w-fit justify-center space-y-8 md:w-80"
    >
      <motion.div
        variants={variants} // Pass the variant object into Framer Motion
        initial="hidden" // Set the initial state to variants.hidden
        animate="enter" // Animated state to variants.enter
        exit="exit" // Exit state (used later) to variants.exit
        transition={{ type: "linear" }} // Set the transition to linear
        className="flex min-w-fit flex-col items-center space-y-8 "
      >
        <p>A code has been sent to your email</p>
        <OtpInput value={otp} valueLength={8} onChange={onChange} />
        {error ? (
          <p className="text-destructive text-sm font-medium">{error}</p>
        ) : null}
        <Button type="submit">Submit</Button>
      </motion.div>
    </form>
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
