import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { isValidationError, publicProcedure } from "@/utils/procedures";
import { APIError, AuthAPI } from "@modal/functions";
import {
  json,
  redirect,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from "@remix-run/node";
import { useActionData, useFetcher } from "@remix-run/react";
import { validationError } from "remix-validated-form";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const isLoggedIn = await AuthAPI.isLoggedIn({ request });
  if (isLoggedIn) return redirect(process.env.APP_URL ?? "/");
  return null;
};

export default function Login() {
  const fetcher = useFetcher();
  const actionData = useActionData<typeof action>();

  return (
    <>
      <h1>Login</h1>
      <fetcher.Form
        method="post"
        className="flex w-1/5 flex-col items-center gap-2"
      >
        <Input name="email" type="email" placeholder="Email" />

        <Button type="submit" className="w-36">
          Generate Token
        </Button>
      </fetcher.Form>
      <EmailError actionData={actionData} />
    </>
  );
}

type ActionData = ReturnType<typeof useActionData<typeof action>>;

const EmailError = ({ actionData }: { actionData: ActionData }) => {
  if (!actionData) return null;

  if (isValidationError(actionData)) {
    return <pre>{JSON.stringify(actionData.fieldErrors)}</pre>;
  }

  if ("error" in actionData) {
    return <pre>{JSON.stringify(actionData.error)}</pre>;
  }

  return <pre>{JSON.stringify(actionData.token)}</pre>;
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await publicProcedure(
    request,
    AuthAPI.issueLoginToken.schema,
  );

  if (formData.error) return validationError(formData.error);

  try {
    const token = await AuthAPI.issueLoginToken(formData.data);
    return json({ token });
  } catch (error) {
    if (error instanceof APIError) {
      return json({ error: error.code, message: error.message });
    }
  }
};
