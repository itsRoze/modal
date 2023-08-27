import Link from "next/link";
import Divider from "@/components/divider";
import { ProjectIcon } from "@/components/icons/project";
import { SpaceIcon } from "@/components/icons/space";
import AppLayout from "@/components/layouts/app/AppLayout";
import { LoadingPage } from "@/components/loading";
import Todo from "@/components/todo";
import Title from "@/components/ui/title";
import { api } from "@/utils/api";
import { CloudMoon } from "lucide-react";

import { type NextPageWithLayout } from "../_app";

const Someday: NextPageWithLayout = () => {
  const { data, isLoading } = api.task.getSomedayTasksByList.useQuery();

  if (isLoading) return <LoadingPage />;
  if (!data && !isLoading) return <div>404</div>;

  return (
    <article className="">
      <Title title="Someday" Icon={CloudMoon} iconColor="text-indigo-300" />
      <section className="custom-scroll h-[calc(100%-150px)] overflow-y-scroll md:h-[calc(100%-69px)]">
        {data.spaceTasks.map((space) => (
          <div key={`space-${space.id}`} className="mb-6">
            <Link href={`/app/space/${encodeURIComponent(space.id)}`}>
              <h2 className="flex w-fit items-center gap-1 text-lg font-bold text-gray-500">
                <SpaceIcon /> {space.name}
              </h2>
            </Link>
            <Divider widthMargin="mx-1" heightPadding="py-2" />
            <ul>
              {space.tasks.map((task) => (
                <li key={task.id} className="">
                  <Todo task={task} displayDeadline={false} />
                </li>
              ))}
            </ul>
          </div>
        ))}
        {data.projectTasks.map((project) =>
          project.tasks.length ? (
            <div key={`project-${project.id}`} className="mb-6">
              <Link href={`/app/project/${encodeURIComponent(project.id)}`}>
                <h2 className="flex w-fit items-center gap-1 text-lg font-bold text-gray-500">
                  <ProjectIcon />
                  {project.name}
                </h2>
              </Link>
              <Divider widthMargin="mx-1" heightPadding="py-2" />

              <ul>
                {project.tasks.map((task) => (
                  <li key={task.id} className="">
                    <Todo task={task} displayDeadline={false} />
                  </li>
                ))}
              </ul>
            </div>
          ) : null,
        )}
      </section>
    </article>
  );
};

Someday.getLayout = (page) => <AppLayout>{page}</AppLayout>;

export default Someday;
