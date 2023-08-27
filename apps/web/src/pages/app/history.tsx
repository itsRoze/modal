import { useEffect, useState } from "react";
import Divider from "@/components/divider";
import AppLayout from "@/components/layouts/app/AppLayout";
import { LoadingPage } from "@/components/loading";
import Todo from "@/components/todo";
import Title from "@/components/ui/title";
import { api } from "@/utils/api";
import { groupTasksByMonth, type IGroupedTasks } from "@modal/common/";
import { BookOpenCheck } from "lucide-react";

import { type NextPageWithLayout } from "../_app";

const History: NextPageWithLayout = () => {
  const { data, isLoading } = api.task.getAllCompletedForUser.useQuery();
  const [groupedTasks, setGroupedTasks] = useState<IGroupedTasks[]>([]);

  useEffect(() => {
    if (data) {
      setGroupedTasks(groupTasksByMonth(data));
    }
  }, [data]);

  if (isLoading) return <LoadingPage />;
  if (!data && !isLoading) return <div>404</div>;

  return (
    <article>
      <Title title="History" Icon={BookOpenCheck} iconColor="text-green-600" />
      <section className="custom-scroll h-[calc(100%-150px)] overflow-y-scroll md:h-[calc(100%-69px)]">
        {groupedTasks.map(({ monthYear, tasks }) => (
          <div key={monthYear} className="py-2">
            <h2 className="text-lg font-bold text-gray-500 ">{monthYear}</h2>
            <Divider widthMargin="mx-1" heightPadding="py-2" />
            <ul>
              {tasks.map((task) => (
                <li key={task.id} className="">
                  <Todo task={task} initialChecked={true} />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>
    </article>
  );
};

History.getLayout = (page) => <AppLayout>{page}</AppLayout>;

export default History;
