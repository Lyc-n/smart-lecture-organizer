DROP INDEX "idx_bookmarks_unique_item";--> statement-breakpoint
DROP INDEX "idx_bookmarks_unique_group";--> statement-breakpoint
CREATE INDEX "idx_groups_user_id" ON "groups" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_groups_parent_id" ON "groups" USING btree ("parent_id");--> statement-breakpoint
CREATE INDEX "idx_items_user_id" ON "items" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_items_type" ON "items" USING btree ("type");--> statement-breakpoint
CREATE INDEX "idx_items_is_pinned" ON "items" USING btree ("is_pinned") WHERE "items"."is_pinned" = true;--> statement-breakpoint
CREATE INDEX "idx_tasks_user_id" ON "tasks" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_tasks_pending" ON "tasks" USING btree ("user_id") WHERE "tasks"."is_completed" = false;--> statement-breakpoint
CREATE INDEX "idx_tasks_deadline" ON "tasks" USING btree ("deadline") WHERE "tasks"."deadline" IS NOT NULL;--> statement-breakpoint
CREATE INDEX "idx_ocr_notes_item_id" ON "ocr_notes" USING btree ("item_id");--> statement-breakpoint
CREATE UNIQUE INDEX "idx_bookmarks_unique_item" ON "bookmarks" USING btree ("user_id","item_id") WHERE "bookmarks"."item_id" IS NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX "idx_bookmarks_unique_group" ON "bookmarks" USING btree ("user_id","group_id") WHERE "bookmarks"."group_id" IS NOT NULL;--> statement-breakpoint
ALTER TABLE "items" ADD CONSTRAINT "items_type_check" CHECK ("items"."type" IN ('document', 'audio', 'video', 'image', 'note'));--> statement-breakpoint
ALTER TABLE "bookmarks" ADD CONSTRAINT "bookmark_target" CHECK ("bookmarks"."item_id" IS NOT NULL OR "bookmarks"."group_id" IS NOT NULL);--> statement-breakpoint
ALTER TABLE "recent_access" ADD CONSTRAINT "recent_target" CHECK ("recent_access"."item_id" IS NOT NULL OR "recent_access"."group_id" IS NOT NULL);