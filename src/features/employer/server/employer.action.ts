"use server";

import { db } from "@/config/db";
import { employers } from "@/drizzle/schema";
import { getCurrentUser } from "@/features/auth/server/auth.queries";
import { eq } from "drizzle-orm";
import { EmployerProfileData } from "../employer.schema";

export const updateEmployerProfileAction = async (
  data: EmployerProfileData
) => {
  try {
    const current_user = await getCurrentUser();
    if (!current_user || current_user.role !== "employer") {
      return {
        status: "error",
        message: "Unauthorized",
      };
    }

    console.log("data", data);

    const {
      description,
      name,
      location,
      organizationType,
      teamSize,
      websiteUrl,
      yearOfEstablishment,
    } = data;

    const updated_record = await db
      .update(employers)
      .set({
        description,
        name,
        location,
        organizationType,
        teamSize,
        websiteUrl,
        yearOfEstablishment: parseInt(yearOfEstablishment),
      })
      .where(eq(employers.id, current_user.id));
    console.log(updated_record);

    return {
      status: "success",
      message: "Profile updated successfully",
    };
  } catch (error) {
    console.log("error", error);

    return {
      status: "error",
      message: "Something went wrong, try again",
    };
  }
};
