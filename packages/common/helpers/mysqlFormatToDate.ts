export const mySqlFormatToDate = (mySqlDate: string): Date => {
  const [year, month, day] = mySqlDate.split("-");
  return new Date(Number(year), Number(month) - 1, Number(day));
};
