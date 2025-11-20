CREATE TYPE "public"."role" AS ENUM('student', 'teacher', 'admin');--> statement-breakpoint
CREATE TYPE "public"."material_type" AS ENUM('word', 'phrase', 'sentence', 'article', 'other');--> statement-breakpoint
CREATE TABLE "daily_records" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"date" date NOT NULL,
	"learned_count" integer DEFAULT 0,
	"review_count" integer DEFAULT 0,
	"streak" integer DEFAULT 0,
	"is_checked" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"password_hash" text NOT NULL,
	"role" "role" DEFAULT 'student' NOT NULL,
	"avatar" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "profiles" (
	"user_id" integer PRIMARY KEY NOT NULL,
	"full_name" text,
	"email" text,
	"phone" text,
	"grade" text,
	"teacher_id" integer,
	"bio" text,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "materials" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"type" "material_type" DEFAULT 'word' NOT NULL,
	"word" text,
	"phonetic_uk" text,
	"phonetic_us" text,
	"translation" text,
	"example" text,
	"content" text,
	"audio_url" text,
	"image_url" text,
	"created_by" integer NOT NULL,
	"is_public" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_progress" (
	"user_id" integer NOT NULL,
	"material_id" integer NOT NULL,
	"learned" boolean DEFAULT false,
	"familiarity" integer DEFAULT 0,
	"last_reviewed_at" timestamp,
	"next_review_at" timestamp,
	"review_count" integer DEFAULT 0,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_progress_user_id_material_id_pk" PRIMARY KEY("user_id","material_id")
);
--> statement-breakpoint
ALTER TABLE "daily_records" ADD CONSTRAINT "daily_records_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_teacher_id_users_id_fk" FOREIGN KEY ("teacher_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "materials" ADD CONSTRAINT "materials_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_progress" ADD CONSTRAINT "user_progress_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_progress" ADD CONSTRAINT "user_progress_material_id_materials_id_fk" FOREIGN KEY ("material_id") REFERENCES "public"."materials"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "daily_records_user_date_idx" ON "daily_records" USING btree ("user_id","date");--> statement-breakpoint
CREATE UNIQUE INDEX "users_username_idx" ON "users" USING btree ("username");