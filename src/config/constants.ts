export const SESSION_LIFE = 30 * 24 * 60 * 60;
export const SESSION_REFRESH_TIME = SESSION_LIFE / 2;

export const SALARY_CURRENCY = ["USD", "EUR", "INR"] as const;
export const SALARY_PERIOD = ["hourly", "monthly", "yearly"] as const;

export const JOB_TYPE = ["remote", "hybrid", "on-site"] as const;

export const WORK_TYPE = [
  "full-time",
  "part-time",
  "contract",
  "temporary",
  "freelance",
] as const;

export const JOB_LEVEL = [
  "internship",
  "entry level",
  "junior",
  "mid level",
  "senior level",
  "lead",
  "manager",
  "director",
  "executive",
] as const;

export const MIN_EDUC = [
  "none",
  "high school",
  "under graduate",
  "master",
  "phd",
] as const;
