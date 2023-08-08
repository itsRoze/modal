import {
  type GetServerSideProps,
  type GetServerSidePropsContext,
  type InferGetServerSidePropsType,
} from "next";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import { api } from "@/utils/api";
import { auth } from "@modal/auth";

import { type NextPageWithLayout } from "../_app";

type PageProps = InferGetServerSidePropsType<typeof getServerSideProps>;

const AccountPage: NextPageWithLayout<PageProps> = ({ session }) => {
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
    } catch (error) {}
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
      <pre>{JSON.stringify(session, null, 2)}</pre>
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
    props: {
      session: {
        sessionId: session.sessionId,
        userId: session.user.userId,
        state: session.state,
        idlePeriodExpiresAt: JSON.stringify(session.idlePeriodExpiresAt),
        activePeriodExpiresAt: JSON.stringify(session.activePeriodExpiresAt),
      },
    },
  };
};

export default AccountPage;
