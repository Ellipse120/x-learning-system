ALTER TABLE "daily_records" ADD COLUMN "material_id" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "daily_records" ADD COLUMN "status" text DEFAULT 'learning' NOT NULL;--> statement-breakpoint
ALTER TABLE "daily_records" ADD COLUMN "notes" text;--> statement-breakpoint
ALTER TABLE "daily_records" ADD CONSTRAINT "daily_records_material_id_materials_id_fk" FOREIGN KEY ("material_id") REFERENCES "public"."materials"("id") ON DELETE cascade ON UPDATE no action;