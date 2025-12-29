"use server";

import { db } from "@/config/db";
import { employers } from "@/drizzle/schema";
import { getCurrentUser } from "@/features/auth/server/auth.queries";
import { eq } from "drizzle-orm";

const organizationTypes = [
  "development",
  "business",
  "finance & accounting",
  "it & software",
  "office productivity",
  "personal development",
  "design",
  "marketing",
  "photography & video",
  "healthcare",
  "education",
  "retail",
  "manufacturing",
  "hospitality",
  "consulting",
  "real estate",
  "legal",
  "other",
] as const;

const teamSizes = [
  "1",
  "2-10",
  "11-50",
  "51-200",
  "201-500",
  "501-1000",
  "1001+",
] as const;

type OrganizationType = (typeof organizationTypes)[number];
type TeamSize = (typeof teamSizes)[number];

interface DataType {
  name: string;
  description: string;
  organizationType: OrganizationType;
  teamSize: TeamSize;
  yearOfEstablishment: string;
  location: string;
  websiteUrl: string;
}

export const updateEmployerProfileAction = async (data: DataType) => {
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
