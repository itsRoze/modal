import { type Info } from "@modal/db/src/task";
import dayjs from "dayjs";

export interface IGroupedTasks {
  monthYear: string;
  tasks: Info[];
}

export const groupTasksByMonth = (tasks: Info[]) => {
  const groupedTasks: IGroupedTasks[] = [];

  for (const task of tasks) {
    if (!task.completedTime) continue;

    const taskMonthYear = formatMonthYear(task.completedTime);
    const existingGroup = groupedTasks.find(
      (group) => group.monthYear === taskMonthYear,
    );

    if (existingGroup) {
      existingGroup.tasks.push(task);
    } else {
      groupedTasks.push({
        monthYear: taskMonthYear,
        tasks: [task],
      });
    }
  }

  return groupedTasks;
};

const formatMonthYear = (date: Date): string => {
  const month = dayjs(date).format("MMMM");
  const year = dayjs(date).format("YYYY");
  return `${month} ${year}`;
};
