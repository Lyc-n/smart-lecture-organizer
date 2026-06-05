ALTER TABLE "materials" ALTER COLUMN "meeting_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "meetings" ALTER COLUMN "subject_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "meetings" ALTER COLUMN "week_number" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "notes" ALTER COLUMN "material_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "materials" ADD COLUMN "subject_id" uuid;--> statement-breakpoint
ALTER TABLE "materials" ADD COLUMN "status" varchar(50) DEFAULT 'pending' NOT NULL;--> statement-breakpoint
ALTER TABLE "materials" ADD COLUMN "category" varchar(100) DEFAULT 'other' NOT NULL;--> statement-breakpoint
ALTER TABLE "materials" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "meetings" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "meetings" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "subjects" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "materials" ADD CONSTRAINT "materials_subject_id_subjects_id_fk" FOREIGN KEY ("subject_id") REFERENCES "public"."subjects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookmarks" ADD CONSTRAINT "uniqueBookmark" UNIQUE("material_id","user_id");--> statement-breakpoint
ALTER TABLE "material_summaries" ADD CONSTRAINT "material_summaries_material_id_unique" UNIQUE("material_id");--> statement-breakpoint
ALTER TABLE "ocr_results" ADD CONSTRAINT "ocr_results_material_id_unique" UNIQUE("material_id");