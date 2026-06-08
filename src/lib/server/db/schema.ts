import {
	pgTable,
	uuid,
	varchar,
	text,
	integer,
	boolean,
	timestamp,
	unique
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { user } from '../../../../auth-schema';

// USERS TABLE & RELATIONS
export const usersRelations = relations(user, ({ many }) => ({
	notifications: many(notifications),
	subjects: many(subjects),
	materials: many(materials), // uploaded_by
	bookmarks: many(bookmarks),
	learningHistories: many(learningHistories),
	downloads: many(downloads)
}));

// NOTIFICATIONS TABLE & RELATIONS
export const notifications = pgTable('notifications', {
	id: uuid('id').primaryKey().defaultRandom(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' }),
	title: varchar('title', { length: 255 }).notNull(),
	message: text('message').notNull(),
	isRead: boolean('is_read').notNull().default(false),
	created_at: timestamp('created_at').notNull().defaultNow()
});

export const notificationsRelations = relations(notifications, ({ one }) => ({
	user: one(user, { fields: [notifications.userId], references: [user.id] })
}));

// SUBJECTS TABLE & RELATIONS
export const subjects = pgTable('subjects', {
	id: uuid('id').primaryKey().defaultRandom(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' }),
	name: varchar('name', { length: 255 }).notNull(),
	description: text('description'),
	createdAt: timestamp('created_at').notNull().defaultNow(),
	updateAt: timestamp('updated_at').notNull().defaultNow()
});

export const subjectsRelations = relations(subjects, ({ one, many }) => ({
	user: one(user, { fields: [subjects.userId], references: [user.id] }),
	materials: many(materials),
	meetings: many(meetings),
	notes: many(notes)
}));

// MEETINGS TABLE & RELATIONS
export const meetings = pgTable('meetings', {
	id: uuid('id').primaryKey().defaultRandom(),
	subjectId: uuid('subject_id').references(() => subjects.id, { onDelete: 'cascade' }),
	weekNumber: integer('week_number'),
	title: varchar('title', { length: 255 }).notNull(),
	description: text('description'),
	createdAt: timestamp('created_at').notNull().defaultNow(),
	updateAt: timestamp('updated_at').notNull().defaultNow()
});

export const meetingsRelations = relations(meetings, ({ one, many }) => ({
	subject: one(subjects, { fields: [meetings.subjectId], references: [subjects.id] }),
	materials: many(materials)
}));

// MATERIALS TABLE & RELATIONS
export const materials = pgTable('materials', {
	id: uuid('id').primaryKey().defaultRandom(),
	subjectId: uuid('subject_id').references(() => subjects.id, { onDelete: 'cascade' }),
	meetingId: uuid('meeting_id').references(() => meetings.id, { onDelete: 'cascade' }),
	uploadedBy: text('uploaded_by')
		.notNull()
		.references(() => user.id),
	title: varchar('title', { length: 255 }).notNull(),
	description: text('description'),
	status: varchar('status', { length: 50 }).default('pending').notNull(), // pending, completed, failed
	category: varchar('category', { length: 100 }).default('other').notNull(),
	fileKey: varchar('file_key', { length: 500 }).notNull(),
	fileUrl: varchar('file_url', { length: 1000 }).notNull(),
	fileName: varchar('file_name', { length: 255 }).notNull(),
	mimeType: varchar('mime_type', { length: 100 }).notNull(),
	fileSize: integer('file_size').notNull(),
	createdAt: timestamp('created_at').notNull().defaultNow(),
	updateAt: timestamp('updated_at').notNull().defaultNow()
});

export const materialsRelations = relations(materials, ({ one, many }) => ({
	subject: one(subjects, { fields: [materials.subjectId], references: [subjects.id] }),
	meeting: one(meetings, { fields: [materials.meetingId], references: [meetings.id] }),
	uploader: one(user, { fields: [materials.uploadedBy], references: [user.id] }),
	ocrResults: one(ocrResults),
	materialSummaries: one(materialSummaries),
	notes: many(notes),
	bookmarks: many(bookmarks),
	learningHistories: many(learningHistories),
	downloads: many(downloads)
}));

// OCR RESULTS TABLE & RELATIONS
export const ocrResults = pgTable('ocr_results', {
	id: uuid('id').primaryKey().defaultRandom(),
	materialId: uuid('material_id')
		.notNull()
		.unique()
		.references(() => materials.id, { onDelete: 'cascade' }),
	extractedText: text('extracted_text').notNull(),
	createdAt: timestamp('created_at').notNull().defaultNow()
});

export const ocrResultsRelations = relations(ocrResults, ({ one }) => ({
	material: one(materials, { fields: [ocrResults.materialId], references: [materials.id] })
}));

// MATERIAL SUMMARIES TABLE & RELATIONS
export const materialSummaries = pgTable('material_summaries', {
	id: uuid('id').primaryKey().defaultRandom(),
	materialId: uuid('material_id')
		.notNull()
		.unique()
		.references(() => materials.id, { onDelete: 'cascade' }),
	summaryText: text('summary_text').notNull(),
	createdAt: timestamp('created_at').notNull().defaultNow()
});

export const materialSummariesRelations = relations(materialSummaries, ({ one }) => ({
	material: one(materials, { fields: [materialSummaries.materialId], references: [materials.id] })
}));

// NOTES TABLE & RELATIONS
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

export const notesRelations = relations(notes, ({ one }) => ({
	material: one(materials, { fields: [notes.materialId], references: [materials.id] }),
	subject: one(subjects, { fields: [notes.subjectId], references: [subjects.id] }),
	user: one(user, { fields: [notes.userId], references: [user.id] })
}));

// BOOKMARKS TABLE & RELATIONS
export const bookmarks = pgTable(
	'bookmarks',
	{
		id: uuid('id').primaryKey().defaultRandom(),
		materialId: uuid('material_id')
			.notNull()
			.references(() => materials.id, { onDelete: 'cascade' }),
		userId: text('user_id')
			.notNull()
			.references(() => user.id, { onDelete: 'cascade' }),
		createdAt: timestamp('created_at').notNull().defaultNow()
	},
	(table) => [unique('uniqueBookmark').on(table.materialId, table.userId)]
);

export const bookmarksRelations = relations(bookmarks, ({ one }) => ({
	material: one(materials, { fields: [bookmarks.materialId], references: [materials.id] }),
	user: one(user, { fields: [bookmarks.userId], references: [user.id] })
}));

// LEARNING HISTORIES TABLE & RELATIONS
export const learningHistories = pgTable('learning_histories', {
	id: uuid('id').primaryKey().defaultRandom(),
	materialId: uuid('material_id')
		.notNull()
		.references(() => materials.id, { onDelete: 'cascade' }),
	userId: text('user_id')
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' }),
	viewedAt: timestamp('viewed_at').notNull().defaultNow()
});

export const learningHistoriesRelations = relations(learningHistories, ({ one }) => ({
	material: one(materials, { fields: [learningHistories.materialId], references: [materials.id] }),
	user: one(user, { fields: [learningHistories.userId], references: [user.id] })
}));

// DOWNLOADS TABLE & RELATIONS
export const downloads = pgTable('downloads', {
	id: uuid('id').primaryKey().defaultRandom(),
	materialId: uuid('material_id')
		.notNull()
		.references(() => materials.id, { onDelete: 'cascade' }),
	userId: text('user_id')
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' }),
	downloadedAt: timestamp('downloaded_at').notNull().defaultNow()
});

export const downloadsRelations = relations(downloads, ({ one }) => ({
	material: one(materials, { fields: [downloads.materialId], references: [materials.id] }),
	user: one(user, { fields: [downloads.userId], references: [user.id] })
}));
