DROP INDEX "daily_records_user_date_idx";--> statement-breakpoint
DROP INDEX "users_username_idx";--> statement-breakpoint
ALTER TABLE "user_progress" DROP CONSTRAINT "user_progress_user_id_material_id_pk";