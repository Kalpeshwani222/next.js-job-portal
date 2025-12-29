import { cookies } from "next/headers";
import { cache, use } from "react";
import { validateSessionAndGetUser } from "./use-cases/sessions";

export const getCurrentUser = cache(async () => {
  const cookieData = await cookies();
  const session = cookieData.get("session")?.value;

  if (!session) return null;

  const user = await validateSessionAndGetUser(session);
  return user;
});
