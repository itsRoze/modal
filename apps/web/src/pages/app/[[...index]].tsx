import AppLayout from "@/components/layouts/app/AppLayout";
import ListView from "@/components/listView";
import Matrix from "@/components/matrix";
import Title from "@/components/ui/title";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import useLocalStorage from "@/hooks/useLocalStorage";
import { cn } from "@/utils/cn";
import { useMediaQuery } from "@uidotdev/usehooks";
import { Home, Info } from "lucide-react";

import { type NextPageWithLayout } from "../_app";

const Dashboard: NextPageWithLayout = () => {
  const [matrixSelected, setMatrixSelected] = useLocalStorage(
    "matrixSelected",
    true,
  );

  // Phones/Tablets
  const isSmallDevice = useMediaQuery("only screen and (max-width : 768px)");

  return (
    <article className="flex flex-col">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Title title="Dashboard" Icon={Home} iconColor="text-fuchsia-500" />
          <TooltipProvider delayDuration={100}>
            <Tooltip>
              <TooltipTrigger>
                <Info size={18} />
              </TooltipTrigger>
              <TooltipContent>
                <p>Only tasks with deadlines appear here</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        {!isSmallDevice ? (
          <div className="flex items-center gap-2 px-4">
            <button
              onClick={() => setMatrixSelected(true)}
              className={cn({
                "px-1 text-lg": true,
                "text-logo underline underline-offset-8": matrixSelected,
                "text-gray-300 hover:text-gray-400 hover:underline hover:underline-offset-8":
                  !matrixSelected,
              })}
            >
              Matrix
            </button>
            <button
              onClick={() => setMatrixSelected(false)}
              className={cn({
                "px-1 text-lg": true,
                "text-logo underline underline-offset-8": !matrixSelected,
                "text-gray-300 hover:text-gray-400 hover:underline hover:underline-offset-8":
                  matrixSelected,
              })}
            >
              List
            </button>
          </div>
        ) : null}
      </div>
      <section className="custom-scroll flex-grow overflow-y-scroll px-2 py-4">
        {matrixSelected && !isSmallDevice ? <Matrix /> : <ListView />}
      </section>
    </article>
  );
};

Dashboard.getLayout = (page) => <AppLayout>{page}</AppLayout>;

export default Dashboard;
