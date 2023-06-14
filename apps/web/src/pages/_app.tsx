import { type ReactElement, type ReactNode } from "react";
import { type NextPage } from "next";
import { type AppProps } from "next/app";
import { api } from "@/utils/api";

import "../styles/globals.css";
import { Toaster } from "@/components/ui/toaster";

// eslint-disable-next-line @typescript-eslint/ban-types
export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const MyApp = ({
  Component,
  pageProps: { ...pageProps },
}: AppPropsWithLayout) => {
  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout ?? ((page) => page);
  const layout = getLayout(<Component {...pageProps} />);

  return (
    <>
      {layout}
      <Toaster />
    </>
  );
};

export default api.withTRPC(MyApp);
