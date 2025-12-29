import { z } from "zod";

export const registerUserSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be atleast 2 chars")
    .max(255, "Name not exceed 255 chars"),

  userName: z
    .string()
    .trim()
    .min(3, "Username must be atleast 3 chars")
    .max(255, "Name not exceed 255 chars")
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      "UserName can only contain letters, numbers, underscrores and hyphens"
    ),

  email: z
    .email("Please enter a valid email address")
    .trim()
    .max(255, "Email must not exceed 255 chars")
    .toLowerCase(),

  password: z
    .string()
    .min(8, "Password must be at least 8 chars long")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one lowercase letter, one uppercase letter, and one number "
    ),

  role: z
    .enum(["applicant", "employer"], {
      error: "Role must be applicant or employer",
    })
    .default("applicant"),
});

//infer automatically create a Typescript type from the Zod schema
export type RegisterUserData = z.infer<typeof registerUserSchema>;

export const registerUserWithConfirmSchema = registerUserSchema
  .extend({
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type RegisterUserWithConfirmData = z.infer<
  typeof registerUserWithConfirmSchema
>;

// login
export const loginUserSchema = z.object({
  email: z
    .email("Please enter a valid email address ")
    .trim()
    .max(255, "Email must not exceed 255 characters")
    .toLowerCase(),

  password: z.string().min(8, "Password must be at least 8 characters long"),
});

export type LoginUserData = z.infer<typeof loginUserSchema>;
