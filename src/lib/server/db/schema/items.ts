import { sql } from 'drizzle-orm';
import { boolean, check, index, jsonb, pgTable, text, timestamp, uuid, bigint } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { users } from './users';
import { itemGroups } from './item-groups';
import { tasks } from './tasks';
import { bookmarks } from './bookmarks';
import { recentAccess } from './recent-access';
import { ocrNotes } from './ocr-notes';

export type Item = typeof items.$inferSelect;
export type NewItem = typeof items.$inferInsert;

export const items = pgTable(
	'items',
	{
		id: uuid('id').defaultRandom().primaryKey(),
		userId: text('user_id')
			.notNull()
			.references(() => users.id, { onDelete: 'cascade' }),
		name: text('name').notNull(),
		type: text('type', {
			enum: ['document', 'audio', 'video', 'image', 'note']
		}).notNull(),
		mimeType: text('mime_type'),
		fileSize: bigint('file_size', { mode: 'number' }),
		fileKey: text('file_key'),
		fileUrl: text('file_url'),
		fileHash: text('file_hash'),
		thumbnailUrl: text('thumbnail_url'),
		isPinned: boolean('is_pinned').notNull().default(false),
		metadata: jsonb('metadata').notNull().default('{}'),
		createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
		updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow()
	},
	(table) => [
		check('items_type_check', sql`${table.type} IN ('document', 'audio', 'video', 'image', 'note')`),
		index('idx_items_user_id').on(table.userId),
		index('idx_items_type').on(table.type),
		index('idx_items_is_pinned').on(table.isPinned).where(sql`${table.isPinned} = true`)
	]
);

export const itemsRelations = relations(items, ({ one, many }) => ({
	user: one(users, {
		fields: [items.userId],
		references: [users.id]
	}),
	groups: many(itemGroups),
	tasks: many(tasks),
	bookmarks: many(bookmarks),
	recentAccess: many(recentAccess),
	ocrNotes: many(ocrNotes)
}));
