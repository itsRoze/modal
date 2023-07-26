import { type Info } from "@modal/db/src/task";
import dayjs from "dayjs";

export const sortTasks = (tasks: Info[]) => {
  tasks.sort((a, b) => {
    // First, sort by priority (true priorities come first)
    if (b.priority && !a.priority) {
      return 1; // b has priority and a does not, so b comes before a
    } else if (!b.priority && a.priority) {
      return -1; // a has priority and b does not, so a comes before b
    }

    // Both tasks have the same priority or no priority, now compare by deadline.
    const deadlineA = a.deadline ? dayjs(a.deadline) : dayjs("9999-12-31");
    const deadlineB = b.deadline ? dayjs(b.deadline) : dayjs("9999-12-31");

    // Sort by the earliest deadline first (tasks without a deadline come last).
    if (deadlineA.isBefore(deadlineB, "day")) {
      return -1; // a comes before b
    } else if (deadlineA.isAfter(deadlineB, "day")) {
      return 1; // b comes before a
    }

    return 0; // Both tasks have the same priority and deadline
  });

  return tasks;
};
