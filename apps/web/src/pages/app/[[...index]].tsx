import AppLayout from "@/components/layouts/app/AppLayout";

import { type NextPageWithLayout } from "../_app";

const Dashboard: NextPageWithLayout = () => {
  return (
    <article>
      <h1>Dashboard</h1>
    </article>
  );
};

Dashboard.getLayout = (page) => <AppLayout>{page}</AppLayout>;

export default Dashboard;
