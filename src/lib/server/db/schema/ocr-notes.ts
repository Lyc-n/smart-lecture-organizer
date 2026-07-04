import { sql } from 'drizzle-orm';
import { index, jsonb, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { items } from './items';

export type OcrNote = typeof ocrNotes.$inferSelect;
export type NewOcrNote = typeof ocrNotes.$inferInsert;

export const ocrNotes = pgTable(
	'ocr_notes',
	{
		id: uuid('id').defaultRandom().primaryKey(),
		itemId: uuid('item_id')
			.notNull()
			.references(() => items.id, { onDelete: 'cascade' }),
		title: text('title'),
		content: text('content').notNull(),
		rawResponse: jsonb('raw_response'),
		createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow()
	},
	(table) => [
		index('idx_ocr_notes_fts').using('gin', sql`to_tsvector('indonesian', coalesce(${table.content}, ''))`),
		index('idx_ocr_notes_item_id').on(table.itemId)
	]
);

export const ocrNotesRelations = relations(ocrNotes, ({ one }) => ({
	item: one(items, {
		fields: [ocrNotes.itemId],
		references: [items.id]
	})
}));
