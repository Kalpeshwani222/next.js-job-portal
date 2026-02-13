"use server";

import { db } from "@/config/db";
import { employers, users } from "@/drizzle/schema";
import { getCurrentUser } from "@/features/auth/server/auth.queries";
import { eq } from "drizzle-orm";
import { EmployerProfileData } from "../employer.schema";

export const updateEmployerProfileAction = async (
  data: EmployerProfileData,
) => {
  try {
    const current_user = await getCurrentUser();
    if (!current_user || current_user.role !== "employer") {
      return {
        status: "error",
        message: "Unauthorized",
      };
    }

    const {
      description,
      name,
      avatarUrl,
      bannerImageUrl,
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
        bannerImageUrl,
        location,
        organizationType,
        teamSize,
        websiteUrl,
        yearOfEstablishment: parseInt(yearOfEstablishment),
      })
      .where(eq(employers.id, current_user.id));

    await db
      .update(users)
      .set({
        avatarUrl,
      })
      .where(eq(users.id, current_user.id));

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
