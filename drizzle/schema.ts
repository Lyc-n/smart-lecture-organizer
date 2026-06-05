import { pgTable, text, integer, foreignKey, uuid, varchar, timestamp, unique, boolean } from "drizzle-orm/pg-core"


export const materials = pgTable("materials", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	meetingId: uuid("meeting_id").notNull(),
	uploadedBy: uuid("uploaded_by").notNull(),
	title: varchar({ length: 255 }).notNull(),
	description: text(),
	fileUrl: varchar("file_url", { length: 500 }).notNull(),
	fileType: varchar("file_type", { length: 50 }).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.meetingId],
			foreignColumns: [meetings.id],
			name: "materials_meeting_id_meetings_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.uploadedBy],
			foreignColumns: [users.id],
			name: "materials_uploaded_by_users_id_fk"
		}),
]);

export const bookmarks = pgTable("bookmarks", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	materialId: uuid("material_id").notNull(),
	userId: uuid("user_id").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.materialId],
			foreignColumns: [materials.id],
			name: "bookmarks_material_id_materials_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "bookmarks_user_id_users_id_fk"
		}).onDelete("cascade"),
]);

export const users = pgTable("users", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	name: varchar({ length: 255 }).notNull(),
	email: varchar({ length: 255 }).notNull(),
	password: varchar({ length: 255 }).notNull(),
	role: boolean().default(false).notNull(),
	isVerified: boolean("is_verified").default(false).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	unique("users_email_unique").on(table.email),
]);

export const downloads = pgTable("downloads", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	materialId: uuid("material_id").notNull(),
	userId: uuid("user_id").notNull(),
	downloadedAt: timestamp("downloaded_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.materialId],
			foreignColumns: [materials.id],
			name: "downloads_material_id_materials_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "downloads_user_id_users_id_fk"
		}).onDelete("cascade"),
]);

export const learningHistories = pgTable("learning_histories", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	materialId: uuid("material_id").notNull(),
	userId: uuid("user_id").notNull(),
	viewedAt: timestamp("viewed_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.materialId],
			foreignColumns: [materials.id],
			name: "learning_histories_material_id_materials_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "learning_histories_user_id_users_id_fk"
		}).onDelete("cascade"),
]);

export const materialSummaries = pgTable("material_summaries", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	materialId: uuid("material_id").notNull(),
	summaryText: text("summary_text").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.materialId],
			foreignColumns: [materials.id],
			name: "material_summaries_material_id_materials_id_fk"
		}).onDelete("cascade"),
]);

export const meetings = pgTable("meetings", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	subjectId: uuid("subject_id").notNull(),
	weekNumber: integer("week_number").notNull(),
	title: varchar({ length: 255 }).notNull(),
	description: text(),
}, (table) => [
	foreignKey({
			columns: [table.subjectId],
			foreignColumns: [subjects.id],
			name: "meetings_subject_id_subjects_id_fk"
		}).onDelete("cascade"),
]);

export const subjects = pgTable("subjects", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: uuid("user_id").notNull(),
	name: varchar({ length: 255 }).notNull(),
	description: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "subjects_user_id_users_id_fk"
		}).onDelete("cascade"),
]);

export const notes = pgTable("notes", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	materialId: uuid("material_id").notNull(),
	content: text().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.materialId],
			foreignColumns: [materials.id],
			name: "notes_material_id_materials_id_fk"
		}).onDelete("cascade"),
]);

export const notifications = pgTable("notifications", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: uuid("user_id").notNull(),
	title: varchar({ length: 255 }).notNull(),
	message: text().notNull(),
	isRead: boolean("is_read").default(false).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "notifications_user_id_users_id_fk"
		}).onDelete("cascade"),
]);

export const ocrResults = pgTable("ocr_results", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	materialId: uuid("material_id").notNull(),
	extractedText: text("extracted_text").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.materialId],
			foreignColumns: [materials.id],
			name: "ocr_results_material_id_materials_id_fk"
		}).onDelete("cascade"),
]);
