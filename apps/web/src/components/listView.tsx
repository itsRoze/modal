import { useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { api } from "@/utils/api";
import { type TaskType } from "@/utils/types";
import { ChevronDown, ChevronRight } from "lucide-react";

import Divider from "./divider";
import Todo from "./todo";

const ListView = () => {
  return (
    <div className="w-full">
      <ListSectionOne />
      <ListSectionTwo />
      <ListSectionThree />
      <ListSectionFour />
    </div>
  );
};

const ListSectionOne = () => {
  const { data: tasks } = api.task.getImportantAndDueSoon.useQuery();

  return (
    <ListSectionDefault title="Important and Due Soon" tasks={tasks ?? []} />
  );
};

const ListSectionTwo = () => {
  const { data: tasks } = api.task.getImportantAndDueLater.useQuery();

  return (
    <ListSectionDefault title="Important and Due Later" tasks={tasks ?? []} />
  );
};

const ListSectionThree = () => {
  const { data: tasks } = api.task.getNotImportantAndDueSoon.useQuery();

  return (
    <ListSectionDefault
      title="Not Important and Due Soon"
      tasks={tasks ?? []}
    />
  );
};

const ListSectionFour = () => {
  const { data: tasks } = api.task.getNotImportantAndDueLater.useQuery();

  return (
    <ListSectionDefault
      title="Not Important and Due Later"
      tasks={tasks ?? []}
    />
  );
};

interface IListSection {
  title: string;
  tasks: TaskType[];
}

const ListSectionDefault: React.FC<IListSection> = ({ title, tasks }) => {
  const [open, setOpen] = useState(true);
  const Icon = open ? ChevronDown : ChevronRight;

  return (
    <Collapsible className="my-2 w-full" open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger className="flex w-full items-center">
        <Icon size={18} className="mr-2 text-gray-500" />
        <h1 className="font-light md:text-2xl">{title}</h1>
      </CollapsibleTrigger>
      <Divider widthMargin="mx-1" heightPadding="py-3" />
      <CollapsibleContent>
        <div className="h-full w-full pb-3">
          <ul className="custom-scroll h-full w-full overflow-y-scroll">
            {tasks
              ? tasks.map((task) => (
                  <li key={task.id}>
                    <Todo task={task} displayList={true} />
                  </li>
                ))
              : null}
          </ul>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default ListView;
