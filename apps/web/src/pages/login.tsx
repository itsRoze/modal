import { useState } from "react";
import Image from "next/image";
import CommercialLayout from "@/components/layouts/commerical/CommercialLayout";
import OtpInput from "@/components/otp";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { ZodError, z, type TypeOf } from "zod";

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
    <article className="flex flex-col items-center justify-center">
      <section className="border-logo flex flex-col items-center justify-center space-y-4 rounded-lg border bg-white  p-4 shadow-lg md:p-10">
        <TokenForm />
      </section>
    </article>
  );
};

const EmailForm = () => {
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

  const onSubmit = (data: FormInput) => {
    console.log(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-80 space-y-8">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="tim@apple.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-center">
          <Button type="submit">Submit</Button>
        </div>
      </form>
    </Form>
  );
};

const TokenForm = () => {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState<string | null>(null);
  const formSchema = z.object({
    otp: z.string().length(6),
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

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      formSchema.parse(otp);
    } catch (error) {
      if (error instanceof ZodError) {
        setError(error.message);
      }
      console.log(error);
    }
  };

  return (
    <motion.form
      variants={variants} // Pass the variant object into Framer Motion
      initial="hidden" // Set the initial state to variants.hidden
      animate="enter" // Animated state to variants.enter
      exit="exit" // Exit state (used later) to variants.exit
      transition={{ type: "linear" }} // Set the transition to linear
      onSubmit={onSubmit}
      className="flex flex-col items-center space-y-4"
    >
      <p>A code has been sent to your email</p>

      <OtpInput value={otp} valueLength={6} onChange={onChange} />
      <Button type="submit">Submit</Button>
    </motion.form>
  );
};

Login.getLayout = (page) => <CommercialLayout>{page}</CommercialLayout>;

export default Login;
