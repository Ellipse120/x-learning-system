ALTER TABLE "materials" DROP CONSTRAINT "materials_created_by_users_id_fk";
--> statement-breakpoint
ALTER TABLE "materials" ADD COLUMN "category" varchar(100) DEFAULT 'uncategorized';--> statement-breakpoint
ALTER TABLE "materials" ADD CONSTRAINT "materials_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;