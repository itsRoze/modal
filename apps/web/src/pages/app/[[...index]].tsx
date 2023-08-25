import AppLayout from "@/components/layouts/app/AppLayout";
import Matrix from "@/components/matrix";
import Title from "@/components/ui/title";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Home, Info } from "lucide-react";

import { type NextPageWithLayout } from "../_app";

const Dashboard: NextPageWithLayout = () => {
  return (
    <article className="flex flex-col">
      <div className="flex items-center">
        <Title title="Dashboard" Icon={Home} iconColor="text-fuchsia-500" />
        <TooltipProvider delayDuration={100}>
          <Tooltip>
            <TooltipTrigger aria-label="Dashboard information tooltip">
              <Info aria-hidden size={18} />
            </TooltipTrigger>
            <TooltipContent>
              <p>Only tasks with deadlines appear here</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <section className="custom-scroll flex-grow overflow-y-scroll px-2 py-4">
        <Matrix />
      </section>
    </article>
  );
};

Dashboard.getLayout = (page) => <AppLayout>{page}</AppLayout>;

export default Dashboard;
