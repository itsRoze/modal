import { UserAPI } from "@modal/api";
import {
  json,
  type ActionFunctionArgs,
  type MetaFunction,
} from "@remix-run/node";
import { Form, useActionData, useLoaderData } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [
    { title: "Modal" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export async function loader() {
  console.log("ENV", process.env.SST_REGION);
  const users = await UserAPI.get_all();
  return json({ message: "hello", users });
}

export default function Index() {
  const loaderData = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();

  return (
    <>
      <h1>Welcome</h1>
      <h2>{loaderData.message}</h2>
      <Form method="post">
        <input name="title" />
        <button type="submit">Submit</button>
      </Form>
      <h2>
        {actionData && actionData.message
          ? JSON.stringify(actionData?.message)
          : "No message"}
      </h2>
      <h2>Users</h2>
      {loaderData.users.length ? (
        <ul>
          {loaderData.users.map((user) => (
            <li key={user.id}>{user.email}</li>
          ))}
        </ul>
      ) : (
        <p>No users</p>
      )}
    </>
  );
}

export async function action({ request }: ActionFunctionArgs) {
  const form = await request.formData();
  return json({ ok: true, message: form.get("title") });
}
