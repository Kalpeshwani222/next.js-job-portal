CREATE TYPE "public"."job_level" AS ENUM('internship', 'entry level', 'junior', 'mid level', 'senior level', 'lead', 'manager', 'director', 'executive');--> statement-breakpoint
CREATE TYPE "public"."job_type" AS ENUM('remote', 'hybrid', 'on-site');--> statement-breakpoint
CREATE TYPE "public"."min_education" AS ENUM('none', 'high school', 'under graduate', 'master', 'phd');--> statement-breakpoint
CREATE TYPE "public"."salary_currency" AS ENUM('USD', 'EUR', 'INR');--> statement-breakpoint
CREATE TYPE "public"."salary_period" AS ENUM('hourly', 'monthly', 'yearly');--> statement-breakpoint
CREATE TYPE "public"."work_type" AS ENUM('full-time', 'part-time', 'contract', 'temporary', 'freelance');--> statement-breakpoint
CREATE TABLE "jobs" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"employer_id" integer NOT NULL,
	"description" text NOT NULL,
	"tags" text[],
	"min_salary" integer,
	"max_salary" integer,
	"salary_currency" "salary_currency",
	"salary_period" "salary_period",
	"location" varchar(255),
	"job_type" "job_type",
	"work_type" "work_type",
	"job_level" "job_level",
	"experience" text,
	"min_education" "min_education",
	"is_featured" boolean DEFAULT false NOT NULL,
	"expires_at" date,
	"deleted_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "jobs" ADD CONSTRAINT "jobs_employer_id_employers_id_fk" FOREIGN KEY ("employer_id") REFERENCES "public"."employers"("id") ON DELETE cascade ON UPDATE no action;