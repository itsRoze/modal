import ErrorPage from "@/components/error";

import { type NextPageWithLayout } from "./_app";

const Error404: NextPageWithLayout = () => {
  return <ErrorPage code={404} />;
};

export default Error404;
