import { pgTable, uuid, integer, varchar, text, timestamp } from 'drizzle-orm/pg-core';
import { subjects } from './subjects';

export const meetings = pgTable('meetings', {
	id: uuid('id').primaryKey().defaultRandom(),
	subjectId: uuid('subject_id').references(() => subjects.id, { onDelete: 'cascade' }),
	weekNumber: integer('week_number'),
	title: varchar('title', { length: 255 }).notNull(),
	description: text('description'),
	createdAt: timestamp('created_at').notNull().defaultNow(),
	updateAt: timestamp('updated_at').notNull().defaultNow()
});
