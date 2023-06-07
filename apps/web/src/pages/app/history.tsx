import AppLayout from "@/components/layouts/app/AppLayout";

import { type NextPageWithLayout } from "../_app";

const History: NextPageWithLayout = () => {
  return (
    <article>
      <h1>History</h1>
    </article>
  );
};

History.getLayout = (page) => <AppLayout>{page}</AppLayout>;

export default History;
