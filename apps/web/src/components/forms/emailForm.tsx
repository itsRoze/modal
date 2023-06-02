import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";

interface IEmailForm {
  onSubmit: (formData: { email: string }) => Promise<void>;
  error: string | null;
  label?: string;
}
const EmailForm: React.FC<IEmailForm> = ({
  onSubmit,
  error,
  label = "Email",
}) => {
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
              <FormLabel>{label}</FormLabel>
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

        <Button>Submit</Button>
      </form>
    </Form>
  );
};

export default EmailForm;
