import { sql } from 'drizzle-orm';
import { check, index, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { users } from './users';
import { items } from './items';
import { groups } from './groups';

export type RecentAccess = typeof recentAccess.$inferSelect;
export type NewRecentAccess = typeof recentAccess.$inferInsert;

export const recentAccess = pgTable(
	'recent_access',
	{
		id: uuid('id').defaultRandom().primaryKey(),
		userId: text('user_id')
			.notNull()
			.references(() => users.id, { onDelete: 'cascade' }),
		itemId: uuid('item_id').references(() => items.id, { onDelete: 'cascade' }),
		groupId: uuid('group_id').references(() => groups.id, { onDelete: 'cascade' }),
		accessedAt: timestamp('accessed_at', { withTimezone: true }).notNull().defaultNow()
	},
	(table) => [
		index('idx_recent_user_time').on(table.userId, table.accessedAt.desc()),
		index('idx_recent_user_item').on(table.userId, table.itemId),
		index('idx_recent_user_group').on(table.userId, table.groupId),
		check('recent_target', sql`${table.itemId} IS NOT NULL OR ${table.groupId} IS NOT NULL`)
	]
);

export const recentAccessRelations = relations(recentAccess, ({ one }) => ({
	user: one(users, {
		fields: [recentAccess.userId],
		references: [users.id]
	}),
	item: one(items, {
		fields: [recentAccess.itemId],
		references: [items.id]
	}),
	group: one(groups, {
		fields: [recentAccess.groupId],
		references: [groups.id]
	})
}));
