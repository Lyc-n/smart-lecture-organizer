import { sql } from 'drizzle-orm';
import { check, pgTable, text, timestamp, uuid, uniqueIndex } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { users } from './users';
import { items } from './items';
import { groups } from './groups';

export type Bookmark = typeof bookmarks.$inferSelect;
export type NewBookmark = typeof bookmarks.$inferInsert;

export const bookmarks = pgTable(
	'bookmarks',
	{
		id: uuid('id').defaultRandom().primaryKey(),
		userId: text('user_id')
			.notNull()
			.references(() => users.id, { onDelete: 'cascade' }),
		itemId: uuid('item_id').references(() => items.id, { onDelete: 'cascade' }),
		groupId: uuid('group_id').references(() => groups.id, { onDelete: 'cascade' }),
		createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow()
	},
	(table) => [
		uniqueIndex('idx_bookmarks_unique_item')
			.on(table.userId, table.itemId)
			.where(sql`${table.itemId} IS NOT NULL`),
		uniqueIndex('idx_bookmarks_unique_group')
			.on(table.userId, table.groupId)
			.where(sql`${table.groupId} IS NOT NULL`),
		check('bookmark_target', sql`${table.itemId} IS NOT NULL OR ${table.groupId} IS NOT NULL`)
	]
);

export const bookmarksRelations = relations(bookmarks, ({ one }) => ({
	user: one(users, {
		fields: [bookmarks.userId],
		references: [users.id]
	}),
	item: one(items, {
		fields: [bookmarks.itemId],
		references: [items.id]
	}),
	group: one(groups, {
		fields: [bookmarks.groupId],
		references: [groups.id]
	})
}));
