import {
  JOB_LEVEL,
  JOB_TYPE,
  MIN_EDUC,
  SALARY_CURRENCY,
  SALARY_PERIOD,
  WORK_TYPE,
} from "@/config/constants";
import { trim, z } from "zod";

export const jobSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(3, "Job title must be atleast 2 chars")
      .max(255, "Job title not exceed 255 chars"),

    description: z
      .string()
      .trim()
      .min(50, "description must be atleast 50 chars")
      .max(5000, "description must not exceed 255 chars"),

    tags: z.array(z.string()).optional(),

    // minSalary: z
    //   .string()
    //   .trim()
    //   .regex(/^\d+$/, "Minimum salary must a valid number")
    //   .optional()
    //   .or(z.literal(""))
    //   .transform((v) => (!v ? null : parseInt(v))),

    // maxSalary: z
    //   .string()
    //   .trim()
    //   .regex(/^\d+$/, "Maximum salary must a valid number")
    //   .optional()
    //   .or(z.literal(""))
    //   .transform((v) => (!v ? null : parseInt(v))),

    minSalary: z
      .union([z.number(), z.string()])
      .optional()
      .transform((v) => {
        if (v === "" || v === undefined || v === null) return null;
        return typeof v === "number" ? v : Number(v);
      })
      .nullable(),

    maxSalary: z
      .union([z.number(), z.string()])
      .optional()
      .transform((v) => {
        if (v === "" || v === undefined || v === null) return null;
        return typeof v === "number" ? v : Number(v);
      })
      .nullable(),

    salaryCurrency: z.enum(SALARY_CURRENCY, {
      error: "Please select a valid currency",
    }),

    salaryPeriod: z.enum(SALARY_PERIOD, {
      error: "Please select a valid salary period",
    }),

    location: z
      .string()
      .trim()
      .min(2, "location must be atleast 2 chars")
      .max(255, "location must not exceed 255 chars"),

    jobType: z.enum(JOB_TYPE, {
      error: "Please select a valid job type",
    }),

    workType: z.enum(WORK_TYPE, {
      error: "Please select a valid work type",
    }),
    jobLevel: z.enum(JOB_LEVEL, {
      error: "Please select a valid job level",
    }),

    experience: z
      .string()
      .trim()
      .max(1000, "experience requirement must not exceed 255 chars")
      .optional()
      .or(z.literal("")),

    minEducation: z
      .enum(MIN_EDUC, {
        error: "Please select a valid education level",
      })
      .optional(),

    expiresAt: z
      .union([z.string(), z.date()])
      .optional()
      .transform((v) => {
        if (!v || v === "") return null;
        if (v instanceof Date) return v;
        return new Date(v);
      })
      .refine(
        (date) => {
          if (!date) return true;
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          return date >= today;
        },
        {
          message: "Expiry date must be today or in the future",
        },
      )
      .nullable(),
  })
  .refine(
    (data) => {
      if (data.minSalary && data.maxSalary) {
        return data.minSalary <= data.maxSalary;
      }
      return true;
    },
    {
      message: "Maximum salary must be greater than or equal to minimum salary",
      path: ["maxSalary"],
    },
  )
  .refine(
    (data) => {
      const hasSalaryInfo =
        data.minSalary ||
        data.maxSalary ||
        data.salaryCurrency ||
        data.salaryPeriod;

      if (hasSalaryInfo) {
        return data.salaryCurrency && data.salaryPeriod;
      }
      return true;
    },
    {
      message: "Currency and period are required when salary is specified",
      path: ["salaryCurrency"],
    },
  );

export type JobFormData = z.infer<typeof jobSchema>;
