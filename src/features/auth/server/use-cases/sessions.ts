import { cookies, headers } from "next/headers";
import crypto from "crypto";
import { getIPAddress } from "./location";
import { db } from "@/config/db";
import { sessions, users } from "@/drizzle/schema";
import { SESSION_LIFE, SESSION_REFRESH_TIME } from "@/config/constants";
import { eq } from "drizzle-orm";

type createSessionData = {
  userAgent: string;
  ip: string;
  userId: number;
  token: string;
  tx?: DbClient;
};

const createUserSession = async ({
  token,
  userId,
  userAgent,
  ip,
  tx = db,
}: createSessionData) => {
  const hashedToken = crypto.createHash("sha-256").update(token).digest("hex");

  const session = await tx.insert(sessions).values({
    id: hashedToken,
    userId,
    expiresAt: new Date(Date.now() + SESSION_LIFE * 1000),
    ip,
    userAgent,
  });

  return session;
};

const generateSessionToken = () => {
  return crypto.randomBytes(32).toString("hex").normalize();
};

type DbClient = typeof db | Parameters<Parameters<typeof db.transaction>[0]>[0];

export const createSessionAndSetCookies = async (
  userId: number,
  tx: DbClient = db
) => {
  const token = generateSessionToken();
  const ip = await getIPAddress();
  const headerList = await headers();

  await createUserSession({
    token,
    userId,
    userAgent: headerList.get("user-agent") || "",
    ip,
    tx,
  });

  const cookieData = await cookies();

  cookieData.set("session", token, {
    secure: true,
    httpOnly: true,
    maxAge: SESSION_LIFE,
  });
};

export const validateSessionAndGetUser = async (session: string) => {
  const hashedToken = crypto
    .createHash("sha-256")
    .update(session)
    .digest("hex");

  const [user] = await db
    .select({
      id: users.id,
      session: {
        id: sessions.id,
        expiresAt: sessions.expiresAt,
        userAgent: sessions.userAgent,
        ip: sessions.ip,
      },
      name: users.name,
      userName: users.username,
      role: users.role,
      phone: users.phone,
      email: users.email,
      createdAt: users.createdAt,
      updatedAt: users.updatedAt,
    })
    .from(sessions)
    .where(eq(sessions.id, hashedToken))
    .innerJoin(users, eq(users.id, sessions.userId));

  if (!user) return null;

  //session is expires
  if (Date.now() >= user.session.expiresAt.getTime()) {
    await invalidateSession(user.session.id);
  }

  //extend the user session by next 30days
  if (
    Date.now() >=
    user.session.expiresAt.getTime() - SESSION_REFRESH_TIME * 1000
  ) {
    await db
      .update(sessions)
      .set({
        expiresAt: new Date(Date.now() + SESSION_LIFE * 1000),
      })
      .where(eq(sessions.id, user.session.id));
  }
  return user;
};

export const invalidateSession = async (id: string) => {
  await db.delete(sessions).where(eq(sessions.id, id));
};
