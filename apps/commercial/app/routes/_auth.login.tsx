import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import capitalize from "@/utils/capitalizeString";
import parseError from "@/utils/parseError";
import redirectIfLoggedIn from "@/utils/redirectIfLoggedIn";
import { Api } from "@modal/functions";
import {
  json,
  redirect,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from "@remix-run/node";
import { useActionData, useFetcher } from "@remix-run/react";

enum Intent {
  IssueToken = "issue-token-intent",
  ValidateToken = "validate-token-intent",
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  return redirectIfLoggedIn(request);
};

export default function Login() {
  return (
    <>
      <h1>Login</h1>
      <EmailForm />
    </>
  );
}

const EmailForm = () => {
  const fetcher = useFetcher();
  const actionData = useActionData<typeof issueTokenAction>();

  const formJsx = (
    <fetcher.Form
      method="post"
      className="flex w-1/5 flex-col items-center gap-2"
    >
      <Input name="email" type="email" placeholder="Email" required />

      <Button
        type="submit"
        className="w-36"
        name="intent"
        value={Intent.IssueToken}
      >
        Generate Token
      </Button>
    </fetcher.Form>
  );

  if (!actionData) {
    return formJsx;
  }

  if ("errors" in actionData) {
    return (
      <>
        {formJsx}
        {Object.keys(actionData.errors).map((key) => (
          <pre key={key}>
            {capitalize(key)}: {actionData.errors[key]}
          </pre>
        ))}
      </>
    );
  }

  if ("error" in actionData) {
    return (
      <>
        {formJsx}
        <pre>{actionData.message}</pre>
      </>
    );
  }

  return <TokenForm userId={actionData.data.userId} />;
};

const TokenForm = ({ userId }: { userId: string }) => {
  const fetcher = useFetcher({ key: "validateToken" });
  const actionData = useActionData<typeof validateTokenAction>();

  if (!userId) return null;
  if (!actionData) {
    return null;
  }

  const formJsx = (
    <fetcher.Form
      method="post"
      className="flex w-1/5 flex-col items-center gap-2"
    >
      <input type="hidden" name="userId" value={userId} />
      <Input name="token" type="text" placeholder="Code" />

      <Button
        type="submit"
        className="w-36"
        name="intent"
        value={Intent.ValidateToken}
      >
        Submit
      </Button>
    </fetcher.Form>
  );

  if ("errors" in actionData) {
    return (
      <>
        {formJsx}
        {Object.keys(actionData.errors).map((key) => (
          <pre key={key}>
            {capitalize(key)}: {actionData.errors[key]}
          </pre>
        ))}
      </>
    );
  }

  if ("error" in actionData) {
    return (
      <>
        {formJsx}
        <pre>{actionData.message}</pre>
      </>
    );
  }

  return formJsx;
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const intent = formData.get("intent");

  switch (intent) {
    case Intent.IssueToken: {
      return issueTokenAction(formData);
    }
    case Intent.ValidateToken: {
      return validateTokenAction(formData, request);
    }
    default: {
      throw new Response(`Invalid intent "${intent}"`, { status: 400 });
    }
  }
};

const issueTokenAction = async (formData: FormData) => {
  try {
    const formPayload = Object.fromEntries(formData);
    const parsed = Api.Auth.issueLoginToken.schema.parse(formPayload);
    console.log("parsed", parsed);
    const result = await Api.Auth.issueLoginToken(parsed);
    return json({
      data: result,
      status: 200,
    });
  } catch (error) {
    const parsed = parseError(error);
    return json(parsed);
  }
};

const validateTokenAction = async (formData: FormData, request: Request) => {
  try {
    const formPayload = Object.fromEntries(formData);
    const parsed = Api.Auth.validateLogin.schema.parse(formPayload);
    const cookie = await Api.Auth.validateLogin({ ...parsed, request });

    return redirect("/", {
      headers: {
        "Set-Cookie": cookie.serialize(),
      },
    });
  } catch (error) {
    const parsed = parseError(error);
    return json(parsed);
  }
};
