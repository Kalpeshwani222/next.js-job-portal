"use server";

import { getCurrentUser } from "@/features/auth/server/auth.queries";
import { JobFormData, jobSchema } from "../jobs/jobs.schema";
import { db } from "@/config/db";
import { jobs } from "@/drizzle/schema";

export const createJobAction = async (data: JobFormData) => {
  try {
    const { success, data: result, error } = jobSchema.safeParse(data);

    console.log(error);
    if (!success) {
      console.log("❌ ZOD ERRORS:", error.flatten());
      console.log("❌ RECEIVED DATA:", data);

      return {
        status: "error",
        message: error.issues[0].message,
      };
    }

    console.log("form data", data);

    const currentUser = await getCurrentUser();

    if (!currentUser || currentUser.role !== "employer") {
      return {
        status: "error",
        message: "Unauthorized",
      };
    }

    const r = await db.insert(jobs).values({
      ...result,
      employerId: currentUser.id,
      expiresAt:
        result.expiresAt instanceof Date
          ? result.expiresAt.toISOString()
          : result.expiresAt,
    });

    console.log("resukt", r);

    return { status: "success", message: "Job posted successfully" };
  } catch (error) {
    console.log("form erorr ", error);

    return {
      status: "error",
      message: "Job Post Failed",
    };
  }
};
