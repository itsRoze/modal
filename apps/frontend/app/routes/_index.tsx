import { auth, generateToken } from "@modal/auth";
import {
  json,
  type LoaderFunctionArgs,
  type MetaFunction,
} from "@remix-run/node";
import { Form, useActionData, useLoaderData } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [
    { title: "Modal" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const authRequest = auth.handleRequest(request);
  const session = await authRequest.validate();
  return json({ session });
};

export default function Index() {
  const { session } = useLoaderData<typeof loader>();
  const data = useActionData<typeof action>();

  return (
    <>
      <h1>Welcome</h1>
      <h2>Token</h2>
      <p>{data && data.token ? JSON.stringify(data.token.token) : "NONE"}</p>
      <Form method="post">
        <button type="submit">Generate Token</button>
      </Form>
    </>
  );
}

export const action = async () => {
  console.log("in here");
  const token = generateToken();
  console.log(token);
  return json({ token });
};
