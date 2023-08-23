import dayjs from "dayjs";

export const getDeadlineDiffFromToday = (deadline: string) => {
  const todayDate = dayjs().startOf("day");
  const deadlineDate = dayjs(deadline).startOf("day");
  const dayDiff = deadlineDate.diff(todayDate, "days");

  return dayDiff;
};
