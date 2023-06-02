import AppLayout from "@/components/layouts/app/AppLayout";

import { type NextPageWithLayout } from "../_app";

const Dashboard: NextPageWithLayout = () => {
  return <h1>Dashboard</h1>;
};

Dashboard.getLayout = (page) => <AppLayout>{page}</AppLayout>;

export default Dashboard;
