import { relations } from "drizzle-orm";

import {
  date,
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const userRoleEnum = pgEnum("user_role_enum", [
  "admin",
  "applicant",
  "employer",
]);

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: varchar({ length: 255 }).notNull(),
  username: varchar("username", { length: 150 }).notNull().unique(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: text("password").notNull(),
  phone: varchar("phone", { length: 20 }),
  avatarUrl: text("avatar_url"),
  role: userRoleEnum("role").notNull().default("applicant"),

  deletedAt: timestamp("deleted_at", {
    withTimezone: true,
  }),

  createdAt: timestamp("created_at", {
    withTimezone: true,
  })
    .notNull()
    .defaultNow(),

  updatedAt: timestamp("updated_at", {
    withTimezone: true,
  })
    .notNull()
    .defaultNow(),
});

export const sessions = pgTable("sessions", {
  id: varchar("id", { length: 255 }).primaryKey(),

  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  userAgent: text("user_agent").notNull(),

  ip: varchar("ip", { length: 45 }).notNull(),

  expiresAt: timestamp("expires_at", {
    withTimezone: true,
  }).notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const employers = pgTable("employers", {
  id: integer("id")
    .primaryKey()
    .references(() => users.id, { onDelete: "cascade" }),

  name: varchar({ length: 255 }),
  description: text("description"),
  bannerImageUrl: text("banner_image_url"),
  organizationType: varchar("organization_type", { length: 255 }),
  teamSize: varchar("team_size", { length: 50 }),
  yearOfEstablishment: integer("year_of_establishment"),
  websiteUrl: varchar("website_url", { length: 255 }),
  location: varchar("location", { length: 255 }),

  deletedAt: timestamp("deleted_at", {
    withTimezone: true,
  }),

  createdAt: timestamp("created_at", {
    withTimezone: true,
  })
    .notNull()
    .defaultNow(),

  updatedAt: timestamp("updated_at", {
    withTimezone: true,
  })
    .notNull()
    .defaultNow(),
});

export const genderEnum = pgEnum("gender", ["male", "female", "other"]);
export const applicantMaritalStatusEnum = pgEnum("applicant_marital_status", [
  "single",
  "married",
]);
export const educationEnum = pgEnum("education", [
  "none",
  "high school",
  "undergraduate",
  "masters",
  "phd",
]);

export const applicants = pgTable("applicants", {
  id: integer("id")
    .primaryKey()
    .references(() => users.id, { onDelete: "cascade" }),

  biography: text("biography"),
  dateOfBirth: date("date_of_birth"),
  nationality: varchar("nationality", { length: 100 }),
  // maritalStatus: maritalStatusEnum("marital_status"),
  maritalStatus: applicantMaritalStatusEnum("marital_status"),

  gender: genderEnum("gender"),
  education: educationEnum("education"),

  experience: text("experience"),
  websiteUrl: varchar("website_url", { length: 255 }),
  location: varchar("location", { length: 255 }),

  deletedAt: timestamp("deleted_at", {
    withTimezone: true,
  }),

  createdAt: timestamp("created_at", {
    withTimezone: true,
  })
    .notNull()
    .defaultNow(),

  updatedAt: timestamp("updated_at", {
    withTimezone: true,
  })
    .notNull()
    .defaultNow(),
});

export const usersRelations = relations(users, ({ one, many }) => ({
  //one User can have One Employer Profile
  employer: one(employers, {
    fields: [users.id],
    references: [employers.id],
  }),

  //one User can have one Applicant Profile
  applicant: one(applicants, {
    fields: [users.id],
    references: [applicants.id],
  }),

  //one user can have many sessions
  sessions: many(sessions),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  //each session belongs to one user
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}));
