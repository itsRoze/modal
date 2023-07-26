import dayjs from "dayjs";

export const getDeadlineDateName = (deadline: string | null) => {
  if (!deadline) return null;

  const deadlineDate = dayjs(deadline);
  const todayDate = dayjs();

  if (deadlineDate.isSame(todayDate, "day")) {
    return "today";
  }

  return deadlineDate.format("MMM D");
};
