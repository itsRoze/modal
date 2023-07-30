import dayjs from "dayjs";

const TRIAL_DURATION = 14; // days

export const getRemainingTrial = (verifiedUserTime: string) => {
  const accountVerifiedDate = dayjs(verifiedUserTime);
  const trialEndDate = accountVerifiedDate.add(TRIAL_DURATION, "day");
  const currentDate = dayjs();

  const remainingDays = trialEndDate.diff(currentDate, "day");
  return remainingDays < 0 ? 0 : remainingDays;
};
