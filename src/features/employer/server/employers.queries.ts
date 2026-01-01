import { db } from "@/config/db";
import { employers } from "@/drizzle/schema";
import { getCurrentUser } from "@/features/auth/server/auth.queries";
import { eq } from "drizzle-orm";

export const getCurrentEmployerDetails = async () => {
  const currentUser = await getCurrentUser();

  if (!currentUser) return null;

  if (currentUser.role !== "employer") return null;

  const [employer] = await db
    .select()
    .from(employers)
    .where(eq(employers.id, currentUser.id));

  const profileStatus =
    employer.name &&
    employer.description &&
    currentUser.avatarUrl &&
    employer.organizationType &&
    employer.yearOfEstablishment;

  return { ...currentUser, employerDetails: employer, status: profileStatus };
};
