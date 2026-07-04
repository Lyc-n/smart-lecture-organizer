DROP INDEX "idx_ocr_notes_fts";--> statement-breakpoint
CREATE INDEX "idx_ocr_notes_fts" ON "ocr_notes" USING gin (to_tsvector('indonesian', coalesce("content", '')));--> statement-breakpoint
ALTER TABLE "ocr_notes" DROP COLUMN "content_tsv";