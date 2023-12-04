import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { isValidationError, publicProcedure } from "@/utils/procedures";
import redirectIfLoggedIn from "@/utils/redirectIfLoggedIn";
import { Api } from "@modal/functions";
import {
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from "@remix-run/node";
import { useActionData, useFetcher } from "@remix-run/react";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  return redirectIfLoggedIn(request);
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
    console.log("here1");
    return <pre>{JSON.stringify(actionData.fieldErrors)}</pre>;
  }

  if ("error" in actionData) {
    console.log("here2");
    return <pre>{actionData.message}</pre>;
  }

  return <pre>{actionData.data.userId}</pre>;
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const result = await publicProcedure(
    request,
    Api.Auth.issueLoginToken.schema,
    Api.Auth.issueLoginToken,
  );

  return result;
};
