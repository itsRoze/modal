import { useEffect, useState } from "react";
import { useRouter } from "next/router";
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
  const { push } = useRouter();
  const { data, isLoading } = api.task.getAllCompletedForUser.useQuery();
  const [groupedTasks, setGroupedTasks] = useState<IGroupedTasks[]>([]);

  useEffect(() => {
    if (data) {
      setGroupedTasks(groupTasksByMonth(data));
    }
  }, [data]);

  if (isLoading) return <LoadingPage />;
  if (!data && !isLoading) {
    void push("/404");
    return null;
  }

  return (
    <article>
      <Title title="History" Icon={BookOpenCheck} iconColor="text-green-600" />
      {groupedTasks.length ? (
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
      ) : (
        <section className="custom-scroll flex h-[calc(100%-150px)] items-center justify-center overflow-y-scroll md:h-[calc(100%-69px)]">
          <div className="text-center text-gray-500">
            <p>
              Completed tasks are displayed here. <br /> Think of it as a
              logbook.
            </p>
            <blockquote className="mt-4 italic">
              &ldquo;The most effective way to do it, is to do it&rdquo; -
              Amelia Earhart
            </blockquote>
          </div>
        </section>
      )}
    </article>
  );
};

History.getLayout = (page) => <AppLayout>{page}</AppLayout>;

export default History;
