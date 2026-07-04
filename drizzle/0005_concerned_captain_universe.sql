DROP INDEX "idx_tasks_deadline";--> statement-breakpoint
CREATE INDEX "idx_tasks_deadline" ON "tasks" USING btree ("deadline") WHERE "tasks"."deadline" IS NOT NULL AND "tasks"."is_completed" = false;