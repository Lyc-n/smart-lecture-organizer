CREATE INDEX "idx_groups_user_sort" ON "groups" USING btree ("user_id","sort_order","name");--> statement-breakpoint
CREATE INDEX "idx_items_user_pinned" ON "items" USING btree ("user_id") WHERE "items"."is_pinned" = true;--> statement-breakpoint
CREATE INDEX "idx_items_user_type" ON "items" USING btree ("user_id","type");--> statement-breakpoint
CREATE INDEX "idx_items_file_hash" ON "items" USING btree ("file_hash");--> statement-breakpoint
CREATE INDEX "idx_item_groups_group_id" ON "item_groups" USING btree ("group_id");--> statement-breakpoint
CREATE INDEX "idx_tasks_user_completed_deadline" ON "tasks" USING btree ("user_id","is_completed","deadline");--> statement-breakpoint
CREATE INDEX "idx_tasks_user_group" ON "tasks" USING btree ("user_id","group_id");--> statement-breakpoint
CREATE INDEX "idx_tasks_user_item" ON "tasks" USING btree ("user_id","item_id");--> statement-breakpoint
CREATE INDEX "idx_tasks_user_completed_sort" ON "tasks" USING btree ("user_id","is_completed","sort_order","created_at");--> statement-breakpoint
CREATE INDEX "idx_bookmarks_user_created" ON "bookmarks" USING btree ("user_id","created_at" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX "idx_recent_user_item" ON "recent_access" USING btree ("user_id","item_id");--> statement-breakpoint
CREATE INDEX "idx_recent_user_group" ON "recent_access" USING btree ("user_id","group_id");