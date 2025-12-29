CREATE TYPE "public"."applicant_marital_status" AS ENUM('single', 'married');--> statement-breakpoint
CREATE TYPE "public"."education" AS ENUM('none', 'high school', 'undergraduate', 'masters', 'phd');--> statement-breakpoint
CREATE TYPE "public"."gender" AS ENUM('male', 'female', 'other');--> statement-breakpoint
CREATE TYPE "public"."user_role_enum" AS ENUM('admin', 'applicant', 'employer');--> statement-breakpoint
CREATE TABLE "applicants" (
	"id" integer PRIMARY KEY NOT NULL,
	"biography" text,
	"date_of_birth" date,
	"nationality" varchar(100),
	"marital_status" "applicant_marital_status",
	"gender" "gender",
	"education" "education",
	"experience" text,
	"website_url" varchar(255),
	"location" varchar(255),
	"deleted_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "employers" (
	"id" integer PRIMARY KEY NOT NULL,
	"name" varchar(255),
	"description" text,
	"avatar_url" text,
	"banner_image_url" text,
	"organization_type" varchar(255),
	"team_size" varchar(50),
	"year_of_establishment" date,
	"website_url" varchar(255),
	"location" varchar(255),
	"deleted_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"user_agent" text NOT NULL,
	"ip" varchar(45) NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"username" varchar(150) NOT NULL,
	"email" varchar(255) NOT NULL,
	"password" text NOT NULL,
	"phone" varchar(20),
	"role" "user_role_enum" DEFAULT 'applicant' NOT NULL,
	"deleted_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_username_unique" UNIQUE("username"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "applicants" ADD CONSTRAINT "applicants_id_users_id_fk" FOREIGN KEY ("id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "employers" ADD CONSTRAINT "employers_id_users_id_fk" FOREIGN KEY ("id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;