import { type GetServerSideProps, type GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import { api } from "@/utils/api";
import { auth } from "@modal/auth";

import { type NextPageWithLayout } from "../_app";

const AccountPage: NextPageWithLayout = () => {
  const { mutateAsync: createCheckoutSession } =
    api.stripe.createCheckoutSession.useMutation();

  const { mutateAsync: createBillingPortalSession } =
    api.stripe.createBillingPortalSession.useMutation();

  const { push } = useRouter();

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      });
      return push("/login");
    } catch (error) {}
  };

  const handleUpgrade = async () => {
    try {
      const { checkoutUrl } = await createCheckoutSession();
      if (checkoutUrl) void push(checkoutUrl);
    } catch (error) {
      console.log(error);
    }
  };

  const handleManageSubscription = async () => {
    const { billingPortalUrl } = await createBillingPortalSession();
    if (billingPortalUrl) void push(billingPortalUrl);
  };

  return (
    <article>
      <h1>Account Page</h1>
      <div className="flex">
        <Button onClick={handleUpgrade}>Upgrade</Button>
        <Button onClick={handleManageSubscription}>Manage Subscription</Button>
        <Button onClick={handleLogout}>Logout</Button>
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
