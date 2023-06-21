import AppLayout from "@/components/layouts/app/AppLayout";
import Title from "@/components/ui/title";
import { BookOpenCheck } from "lucide-react";

import { type NextPageWithLayout } from "../_app";

const History: NextPageWithLayout = () => {
  return (
    <article>
      <Title title="History" Icon={BookOpenCheck} iconColor="text-green-600" />
    </article>
  );
};

History.getLayout = (page) => <AppLayout>{page}</AppLayout>;

export default History;
