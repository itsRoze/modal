import { type Info } from "@modal/db/src/task";
import dayjs from "dayjs";

export const organizeTasks = (tasks: Info[]) => {
  const typeOneTasks: Info[] = [];
  const typeTwoTasks: Info[] = [];
  const typeThreeTasks: Info[] = [];
  const typeFourTasks: Info[] = [];

  for (const t of tasks) {
    const { deadline, priority } = t;

    const todayDate = dayjs().startOf("day");
    const deadlineDate = dayjs(deadline).startOf("day");
    const dayDiff = deadlineDate.diff(todayDate, "days");

    if (priority) {
      // Important
      if (dayDiff < 3) typeOneTasks.push(t); // Due Soon
      else typeTwoTasks.push(t); // Due Later
    } else {
      // Not Important
      if (dayDiff < 3) typeThreeTasks.push(t); // Due Soon
      else typeFourTasks.push(t); // Due Later
    }
  }

  typeOneTasks.sort((a, b) => sortByDeadline(a, b));
  typeTwoTasks.sort((a, b) => sortByDeadline(a, b));
  typeThreeTasks.sort((a, b) => sortByDeadline(a, b));
  typeFourTasks.sort((a, b) => sortByDeadline(a, b));

  return {
    typeOneTasks,
    typeTwoTasks,
    typeThreeTasks,
    typeFourTasks,
  };
};

const sortByDeadline = (a: Info, b: Info) => {
  return dayjs(a.deadline).isBefore(dayjs(b.deadline)) ? -1 : 1;
};
