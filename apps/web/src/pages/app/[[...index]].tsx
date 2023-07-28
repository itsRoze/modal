import AppLayout from "@/components/layouts/app/AppLayout";
import Matrix from "@/components/matrix";
import Title from "@/components/ui/title";
import { Home } from "lucide-react";

import { type NextPageWithLayout } from "../_app";

const Dashboard: NextPageWithLayout = () => {
  return (
    <article className="flex flex-col">
      <Title title="Dashboard" Icon={Home} iconColor="text-fuchsia-500" />
      <section className="custom-scroll flex-grow overflow-y-scroll px-2 py-4">
        <Matrix />
      </section>
    </article>
  );
};

Dashboard.getLayout = (page) => <AppLayout>{page}</AppLayout>;

export default Dashboard;
