ALTER TABLE "materials" ADD COLUMN "file_key" varchar(500) NOT NULL;--> statement-breakpoint
ALTER TABLE "materials" ADD COLUMN "file_url" varchar(1000) NOT NULL;--> statement-breakpoint
ALTER TABLE "materials" DROP COLUMN "blob_path";