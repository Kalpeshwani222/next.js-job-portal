"use server";

import { db } from "@/config/db";
import { applicants, employers, users } from "@/drizzle/schema";
import argon2 from "argon2";
import { eq, or } from "drizzle-orm";
import {
  LoginUserData,
  loginUserSchema,
  RegisterUserData,
  registerUserSchema,
} from "../auth.schema";
import {
  createSessionAndSetCookies,
  invalidateSession,
} from "./use-cases/sessions";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import crypto from "crypto";

export const registrationAction = async (data: RegisterUserData) => {
  try {
    const { data: validatedData, error } = registerUserSchema.safeParse(data);

    if (error) return { status: "error", message: error.issues[0].message };

    const { name, email, userName, password, role } = validatedData;

    const [user] = await db
      .select()
      .from(users)
      .where(or(eq(users.email, email), eq(users.username, userName)));

    if (user) {
      if (user.email === email || user.username === userName) {
        return {
          status: "error",
          message: "Email or UserName already exists",
        };
      }
    }
    const hashPassword = await argon2.hash(password);

    const insertedUser = await db.transaction(async (tx) => {
      const [result] = await tx
        .insert(users)
        .values({
          name,
          email,
          username: userName,
          password: hashPassword,
          role,
        })
        .returning();

      if (role === "applicant") {
        await tx.insert(applicants).values({ id: result.id });
      } else {
        await tx.insert(employers).values({ id: result.id });
      }

      //insert the session and set the cookie
      await createSessionAndSetCookies(result.id, tx);

      return result;
    });

    return {
      status: "success",
      message: "Registration Completed",
      data: insertedUser,
    };
  } catch (error) {
    return {
      status: "error",
      message: "Registration Failed",
    };
  }
};

export const loginUserAction = async (data: LoginUserData) => {
  try {
    const { data: validateData, error } = loginUserSchema.safeParse(data);

    if (error) return { status: "error", message: error.issues[0].message };

    const { email, password } = validateData;

    const [user] = await db.select().from(users).where(eq(users.email, email));

    if (!user) {
      return {
        status: "error",
        message: "Invalid Email/Password",
      };
    }

    const hashPassword = await argon2.verify(user.password, password);

    if (!hashPassword) {
      return {
        status: "error",
        message: "Invalid Email/Password",
      };
    }

    await createSessionAndSetCookies(user.id);

    return {
      status: "success",
      message: "Login Successful!",
    };
  } catch (error) {
    return {
      status: "error",
      message: "Login Failed",
    };
  }
};

export const logoutUserAction = async () => {
  const cookieData = await cookies();
  const session = cookieData.get("session")?.value;

  if (!session) return redirect("/login");

  const hashedToken = crypto
    .createHash("sha-256")
    .update(session)
    .digest("hex");

  //delete the session entry in the db
  await invalidateSession(hashedToken);

  //delete the cookie in the Client side
  cookieData.delete("session");

  return redirect("/login");
};
