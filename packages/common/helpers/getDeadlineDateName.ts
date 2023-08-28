import dayjs from "dayjs";

export const getDeadlineDateName = (deadline: string | null) => {
  if (!deadline) return "someday";

  const deadlineDate = dayjs(deadline);
  const todayDate = dayjs();

  if (deadlineDate.isSame(todayDate, "day")) {
    return "Today";
  }

  return deadlineDate.format("MMM D");
};
