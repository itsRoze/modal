import { type GetServerSideProps, type GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import { api } from "@/utils/api";
import { auth } from "@modal/auth";

import { type NextPageWithLayout } from "../_app";

const AccountPage: NextPageWithLayout = () => {
  const { mutateAsync: createCheckoutSession } =
    api.stripe.createCheckoutSession.useMutation();
  const { push } = useRouter();

  const handleUpgrade = async () => {
    try {
      const { checkoutUrl } = await createCheckoutSession();
      console.log(checkoutUrl);
      if (checkoutUrl) void push(checkoutUrl);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <article>
      <h1>Account Page</h1>
      <div className="flex">
        <Button onClick={handleUpgrade}>Upgrade</Button>
        <Button>Manage Subscription</Button>
      </div>
    </article>
  );
};

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext,
) => {
  const { req, res } = context;
  const authRequest = auth.handleRequest(req, res);
  const session = await authRequest.validate();

  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }
  return {
    props: {},
  };
};

export default AccountPage;
