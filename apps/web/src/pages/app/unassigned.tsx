import { useRouter } from "next/router";
import AppLayout from "@/components/layouts/app/AppLayout";
import { LoadingPage } from "@/components/loading";
import Todo from "@/components/todo";
import Title from "@/components/ui/title";
import { api } from "@/utils/api";
import { Inbox } from "lucide-react";

import { type NextPageWithLayout } from "../_app";

const Unassigned: NextPageWithLayout = () => {
  const { push } = useRouter();
  const { data, isLoading } = api.task.getUnassigned.useQuery();

  if (isLoading) return <LoadingPage />;
  if (!data && !isLoading) {
    void push("/404");
    return null;
  }

  if (data.length == 0) {
    return (
      <article>
        <Title title="Unassigned" Icon={Inbox} iconColor="text-rose-400" />
        <section className="custom-scroll flex h-[calc(100%-150px)] items-center justify-center overflow-y-scroll md:h-[calc(100%-69px)]">
          <div className="text-center text-gray-500">
            <p>
              Your organizational skills are exceptional! Tasks without a space
              or project reside here.
            </p>
            <blockquote className="mt-4 italic">
              &ldquo;I&apos;m far from being god, but I work god damn
              hard&rdquo; - Jay-Z
            </blockquote>
          </div>
        </section>
      </article>
    );
  }
  return (
    <article>
      <Title title="Unassigned" Icon={Inbox} iconColor="text-rose-400" />
      <section className="custom-scroll h-[calc(100%-150px)] overflow-y-scroll md:h-[calc(100%-69px)]">
        <ul>
          {data.map((task) => (
            <li key={task.id}>
              <Todo task={task} />
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
};

Unassigned.getLayout = (page) => <AppLayout>{page}</AppLayout>;

export default Unassigned;
