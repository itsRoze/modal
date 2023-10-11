import { useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { api } from "@/utils/api";
import { type TaskType } from "@/utils/types";
import { DUE_SOON_DAYS, dateToMySqlFormat } from "@modal/common";
import { ChevronDown, ChevronRight } from "lucide-react";

import Divider from "./divider";
import { NewTodo } from "./newTodo";
import Todo from "./todo";

const TODAY_DATE = new Date();
const LATER_DATE = new Date();
LATER_DATE.setDate(LATER_DATE.getDate() + DUE_SOON_DAYS + 1);

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
    <ListSectionDefault
      title="Important and Due Soon"
      tasks={tasks ?? []}
      todoDeadline={dateToMySqlFormat(TODAY_DATE)}
      todoPriority={true}
    />
  );
};

const ListSectionTwo = () => {
  const { data: tasks } = api.task.getImportantAndDueLater.useQuery();

  return (
    <ListSectionDefault
      title="Important and Due Later"
      tasks={tasks ?? []}
      todoDeadline={dateToMySqlFormat(LATER_DATE)}
      todoPriority={true}
    />
  );
};

const ListSectionThree = () => {
  const { data: tasks } = api.task.getNotImportantAndDueSoon.useQuery();

  return (
    <ListSectionDefault
      title="Not Important and Due Soon"
      tasks={tasks ?? []}
      todoDeadline={dateToMySqlFormat(TODAY_DATE)}
      todoPriority={false}
    />
  );
};

const ListSectionFour = () => {
  const { data: tasks } = api.task.getNotImportantAndDueLater.useQuery();

  return (
    <ListSectionDefault
      title="Not Important and Due Later"
      tasks={tasks ?? []}
      todoDeadline={dateToMySqlFormat(LATER_DATE)}
      todoPriority={false}
    />
  );
};

interface IListSection {
  title: string;
  tasks: TaskType[];
  todoDeadline: string;
  todoPriority: boolean;
}

const ListSectionDefault: React.FC<IListSection> = ({
  title,
  tasks,
  todoDeadline,
  todoPriority,
}) => {
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
        <div className="flex h-full w-full flex-col pb-3">
          <ul className="custom-scroll h-full w-full overflow-y-scroll">
            {tasks
              ? tasks.map((task) => (
                  <li key={task.id}>
                    <Todo task={task} displayList={true} />
                  </li>
                ))
              : null}
          </ul>
          <NewTodo dueDate={todoDeadline} priority={todoPriority} />
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default ListView;
