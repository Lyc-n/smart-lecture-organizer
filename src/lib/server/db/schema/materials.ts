import { pgTable, uuid, varchar, text, integer, timestamp } from 'drizzle-orm/pg-core';
import { user } from '../../../../../auth-schema';
import { subjects } from './subjects';
import { meetings } from './meetings';

export const materials = pgTable('materials', {
	id: uuid('id').primaryKey().defaultRandom(),
	subjectId: uuid('subject_id').references(() => subjects.id, { onDelete: 'cascade' }),
	meetingId: uuid('meeting_id').references(() => meetings.id, { onDelete: 'cascade' }),
	uploadedBy: text('uploaded_by')
		.notNull()
		.references(() => user.id),
	title: varchar('title', { length: 255 }).notNull(),
	description: text('description'),
	status: varchar('status', { length: 50 }).default('pending').notNull(),
	category: varchar('category', { length: 100 }).default('other').notNull(),
	fileKey: varchar('file_key', { length: 500 }).notNull(),
	fileUrl: varchar('file_url', { length: 1000 }).notNull(),
	fileName: varchar('file_name', { length: 255 }).notNull(),
	mimeType: varchar('mime_type', { length: 100 }).notNull(),
	fileSize: integer('file_size').notNull(),
	createdAt: timestamp('created_at').notNull().defaultNow(),
	updateAt: timestamp('updated_at').notNull().defaultNow()
});
