import { pgTable, uuid, varchar, text, timestamp } from 'drizzle-orm/pg-core';
import { user } from '../../../../../auth-schema';
import { materials } from './materials';
import { subjects } from './subjects';

export const notes = pgTable('notes', {
	id: uuid('id').primaryKey().defaultRandom(),
	materialId: uuid('material_id').references(() => materials.id, { onDelete: 'cascade' }),
	subjectId: uuid('subject_id').references(() => subjects.id, { onDelete: 'cascade' }),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	title: varchar('title', { length: 255 }).notNull().default('Untitled'),
	content: text('content').notNull(),
	createdAt: timestamp('created_at').notNull().defaultNow(),
	updatedAt: timestamp('updated_at').notNull().defaultNow()
});
