import dayjs from "dayjs";

export const getCompletedDate = (completedTime: string | null) => {
  if (!completedTime) return "someday";

  const completedDate = dayjs(completedTime);
  const month = completedDate.format("M");
  const day = completedDate.format("D");

  return `${month}/${day}`;
};
