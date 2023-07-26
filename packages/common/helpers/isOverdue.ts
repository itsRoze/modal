import dayjs from "dayjs";

export const isOverdue = (deadline: string | null) => {
  const currentDate = dayjs();
  const deadlineDate = dayjs(deadline);

  return deadlineDate.isBefore(currentDate, "day");
};
