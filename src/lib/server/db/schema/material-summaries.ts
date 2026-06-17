import { pgTable, uuid, text, timestamp } from 'drizzle-orm/pg-core';
import { materials } from './materials';

export const materialSummaries = pgTable('material_summaries', {
	id: uuid('id').primaryKey().defaultRandom(),
	materialId: uuid('material_id')
		.notNull()
		.unique()
		.references(() => materials.id, { onDelete: 'cascade' }),
	summaryText: text('summary_text').notNull(),
	createdAt: timestamp('created_at').notNull().defaultNow()
});
