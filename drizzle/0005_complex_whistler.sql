ALTER TABLE "materials" ADD COLUMN "blob_path" varchar(500) NOT NULL;--> statement-breakpoint
ALTER TABLE "materials" ADD COLUMN "file_name" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "materials" ADD COLUMN "mime_type" varchar(100) NOT NULL;--> statement-breakpoint
ALTER TABLE "materials" ADD COLUMN "file_size" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "materials" DROP COLUMN "file_url";--> statement-breakpoint
ALTER TABLE "materials" DROP COLUMN "file_type";