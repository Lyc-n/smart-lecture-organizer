import { pgTable, uuid, text, timestamp } from 'drizzle-orm/pg-core';
import { materials } from './materials';

export const ocrResults = pgTable('ocr_results', {
	id: uuid('id').primaryKey().defaultRandom(),
	materialId: uuid('material_id')
		.notNull()
		.unique()
		.references(() => materials.id, { onDelete: 'cascade' }),
	extractedText: text('extracted_text').notNull(),
	createdAt: timestamp('created_at').notNull().defaultNow()
});
