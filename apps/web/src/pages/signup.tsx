import { type GetServerSideProps, type GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import CommercialLayout from "@/components/layouts/commerical/CommercialLayout";
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
import { z } from "zod";

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
      className={`${anybody.variable} font-mono`}
    >
      <section className="flex flex-col items-center justify-center px-16">
        <h1 className="text-center text-2xl font-medium md:text-7xl">
          Start with a 7 day free trial
        </h1>
        <h2 className="py-2 text-lg font-light md:py-8 md:text-4xl">
          Cancel anytime
        </h2>
      </section>
      <section className="mt-10 flex justify-center md:mt-5">
        <div className="relative md:w-fit">
          <div className="border-logo relative flex flex-col items-center space-y-12 rounded-lg border p-4 shadow-xl md:p-12">
            <div className="flex items-center justify-center">
              <SignupForm />
            </div>
          </div>
          <div className="absolute -right-10 -top-5 rotate-6 transform rounded-md bg-orange-400 p-1 font-medium uppercase text-white md:p-4">
            Just need an email
          </div>
        </div>
      </section>
    </motion.article>
  );
};

const SignupForm = () => {
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

  const onSubmit = (value: FormInput) => {
    console.log(value);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col items-center space-y-4"
      >
        <FormField
          name="email"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  {...field}
                  type="email"
                  placeholder="tim@email.com"
                  className="text-gray-500"
                />
              </FormControl>
            </FormItem>
          )}
        />
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
