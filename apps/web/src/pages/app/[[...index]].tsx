import AppLayout from "@/components/layouts/app/AppLayout";
import Title from "@/components/ui/title";
import { Home } from "lucide-react";

import { type NextPageWithLayout } from "../_app";

const Dashboard: NextPageWithLayout = () => {
  return (
    <article>
      <Title title="Dashboard" Icon={Home} iconColor="text-fuchsia-500" />
    </article>
  );
};

Dashboard.getLayout = (page) => <AppLayout>{page}</AppLayout>;

export default Dashboard;
