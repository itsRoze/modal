import { useState } from "react";
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
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { ZodError, z } from "zod";

import { type NextPageWithLayout } from "./_app";

const Login: NextPageWithLayout = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [token, setToken] = useState("");

  return (
    <article className="flex flex-col items-center justify-center md:mx-20">
      <section className="border-logo flex w-full flex-col items-center justify-center space-y-4 rounded-lg border bg-white py-2  shadow-lg md:p-10">
        {!userId ? (
          <EmailForm setUserId={setUserId} />
        ) : (
          <TokenForm otp={token} setOtp={setToken} userId={userId} />
        )}
      </section>
    </article>
  );
};

type ResponseData = {
  userId?: string;
  error?: string;
};

const EmailForm = ({
  setUserId,
}: {
  setUserId: React.Dispatch<React.SetStateAction<string | null>>;
}) => {
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

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex w-full flex-col items-center space-y-8 md:w-80"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="tim@apple.com"
                  className="w-72 "
                  {...field}
                />
              </FormControl>
              <FormMessage />
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
    <form
      onSubmit={onSubmit}
      className="flex w-full justify-center space-y-8 md:w-80"
    >
      <motion.div
        variants={variants} // Pass the variant object into Framer Motion
        initial="hidden" // Set the initial state to variants.hidden
        animate="enter" // Animated state to variants.enter
        exit="exit" // Exit state (used later) to variants.exit
        transition={{ type: "linear" }} // Set the transition to linear
        className="flex flex-col items-center space-y-8 "
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

Login.getLayout = (page) => <CommercialLayout>{page}</CommercialLayout>;

export default Login;
