import { sql } from 'drizzle-orm';
import { boolean, index, integer, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { users } from './users';
import { groups } from './groups';
import { items } from './items';

export type Task = typeof tasks.$inferSelect;
export type NewTask = typeof tasks.$inferInsert;

export const tasks = pgTable(
	'tasks',
	{
		id: uuid('id').defaultRandom().primaryKey(),
		userId: text('user_id')
			.notNull()
			.references(() => users.id, { onDelete: 'cascade' }),
		groupId: uuid('group_id').references(() => groups.id, { onDelete: 'set null' }),
		itemId: uuid('item_id').references(() => items.id, { onDelete: 'set null' }),
		title: text('title').notNull(),
		description: text('description'),
		deadline: timestamp('deadline', { withTimezone: true }),
		isCompleted: boolean('is_completed').notNull().default(false),
		completedAt: timestamp('completed_at', { withTimezone: true }),
		sortOrder: integer('sort_order').notNull().default(0),
		createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
		updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow()
	},
	(table) => [
		index('idx_tasks_user_id').on(table.userId),
		index('idx_tasks_pending').on(table.userId).where(sql`${table.isCompleted} = false`),
		index('idx_tasks_deadline').on(table.deadline).where(sql`${table.deadline} IS NOT NULL AND ${table.isCompleted} = false`)
	]
);

export const tasksRelations = relations(tasks, ({ one }) => ({
	user: one(users, {
		fields: [tasks.userId],
		references: [users.id]
	}),
	group: one(groups, {
		fields: [tasks.groupId],
		references: [groups.id]
	}),
	item: one(items, {
		fields: [tasks.itemId],
		references: [items.id]
	})
}));
