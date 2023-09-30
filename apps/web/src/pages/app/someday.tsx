import Link from "next/link";
import { useRouter } from "next/router";
import Divider from "@/components/divider";
import { ProjectIcon } from "@/components/icons/project";
import { SpaceIcon } from "@/components/icons/space";
import AppLayout from "@/components/layouts/app/AppLayout";
import { LoadingPage } from "@/components/loading";
import Todo from "@/components/todo";
import Title from "@/components/ui/title";
import { api } from "@/utils/api";
import { CloudMoon, Inbox } from "lucide-react";

import { type NextPageWithLayout } from "../_app";

const Someday: NextPageWithLayout = () => {
  const { push } = useRouter();
  const { data, isLoading } = api.task.getSomedayTasksByList.useQuery();
  const { data: taskCount, isLoading: isTaskCountLoading } =
    api.task.getSomedayTaskCount.useQuery();

  if (isLoading || isTaskCountLoading) return <LoadingPage />;
  if (!data && !isLoading) {
    void push("/404");
    return null;
  }

  // == since taskCount type also includes undefined
  if (taskCount !== undefined && taskCount == 0) {
    return (
      <article>
        <Title title="Someday" Icon={CloudMoon} iconColor="text-indigo-300" />
        <section className="custom-scroll flex h-[calc(100%-150px)] items-center justify-center overflow-y-scroll md:h-[calc(100%-69px)]">
          <div className="text-center text-gray-500">
            <p>Incomplete tasks without deadlines are displayed here.</p>
            <blockquote className="mt-4 italic">
              &ldquo;The journey of a thousand miles begins with one
              step.&rdquo; - Lao Tzu
            </blockquote>
          </div>
        </section>
      </article>
    );
  }

  return (
    <article>
      <Title title="Someday" Icon={CloudMoon} iconColor="text-indigo-300" />
      <section className="custom-scroll h-[calc(100%-150px)] overflow-y-scroll md:h-[calc(100%-69px)]">
        {data.spaceTasks.map((space) =>
          space.tasks.length ? (
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
          ) : null,
        )}
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
        {data.unassignedTasks.length ? (
          <div className="mb-6">
            <Link href={`/app/unassigned`}>
              <h2 className="flex w-fit items-center gap-1 text-lg font-bold text-gray-500">
                <Inbox className="text-red-400" />
                Unassigned
              </h2>
            </Link>
            <Divider widthMargin="mx-1" heightPadding="py-2" />

            <ul>
              {data.unassignedTasks.map((task) => (
                <li key={task.id} className="">
                  <Todo task={task} displayDeadline={false} />
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </section>
    </article>
  );
};

Someday.getLayout = (page) => <AppLayout>{page}</AppLayout>;

export default Someday;
