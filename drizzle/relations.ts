import { relations } from "drizzle-orm/relations";
import { meetings, materials, users, bookmarks, downloads, learningHistories, materialSummaries, subjects, notes, notifications, ocrResults } from "./schema";

export const materialsRelations = relations(materials, ({one, many}) => ({
	meeting: one(meetings, {
		fields: [materials.meetingId],
		references: [meetings.id]
	}),
	user: one(users, {
		fields: [materials.uploadedBy],
		references: [users.id]
	}),
	bookmarks: many(bookmarks),
	downloads: many(downloads),
	learningHistories: many(learningHistories),
	materialSummaries: many(materialSummaries),
	notes: many(notes),
	ocrResults: many(ocrResults),
}));

export const meetingsRelations = relations(meetings, ({one, many}) => ({
	materials: many(materials),
	subject: one(subjects, {
		fields: [meetings.subjectId],
		references: [subjects.id]
	}),
}));

export const usersRelations = relations(users, ({many}) => ({
	materials: many(materials),
	bookmarks: many(bookmarks),
	downloads: many(downloads),
	learningHistories: many(learningHistories),
	subjects: many(subjects),
	notifications: many(notifications),
}));

export const bookmarksRelations = relations(bookmarks, ({one}) => ({
	material: one(materials, {
		fields: [bookmarks.materialId],
		references: [materials.id]
	}),
	user: one(users, {
		fields: [bookmarks.userId],
		references: [users.id]
	}),
}));

export const downloadsRelations = relations(downloads, ({one}) => ({
	material: one(materials, {
		fields: [downloads.materialId],
		references: [materials.id]
	}),
	user: one(users, {
		fields: [downloads.userId],
		references: [users.id]
	}),
}));

export const learningHistoriesRelations = relations(learningHistories, ({one}) => ({
	material: one(materials, {
		fields: [learningHistories.materialId],
		references: [materials.id]
	}),
	user: one(users, {
		fields: [learningHistories.userId],
		references: [users.id]
	}),
}));

export const materialSummariesRelations = relations(materialSummaries, ({one}) => ({
	material: one(materials, {
		fields: [materialSummaries.materialId],
		references: [materials.id]
	}),
}));

export const subjectsRelations = relations(subjects, ({one, many}) => ({
	meetings: many(meetings),
	user: one(users, {
		fields: [subjects.userId],
		references: [users.id]
	}),
}));

export const notesRelations = relations(notes, ({one}) => ({
	material: one(materials, {
		fields: [notes.materialId],
		references: [materials.id]
	}),
}));

export const notificationsRelations = relations(notifications, ({one}) => ({
	user: one(users, {
		fields: [notifications.userId],
		references: [users.id]
	}),
}));

export const ocrResultsRelations = relations(ocrResults, ({one}) => ({
	material: one(materials, {
		fields: [ocrResults.materialId],
		references: [materials.id]
	}),
}));