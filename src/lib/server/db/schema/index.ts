import { relations } from 'drizzle-orm';
import { user } from '../../../../../auth-schema';

export { subjects } from './subjects';
export { meetings } from './meetings';
export { materials } from './materials';
export { notes } from './notes';
export { bookmarks } from './bookmarks';
export { notifications } from './notifications';
export { ocrResults } from './ocr-results';
export { materialSummaries } from './material-summaries';
export { learningHistories } from './learning-histories';
export { downloads } from './downloads';

// ── Import tables for relations ──
import { subjects } from './subjects';
import { meetings } from './meetings';
import { materials } from './materials';
import { notes } from './notes';
import { bookmarks } from './bookmarks';
import { notifications } from './notifications';
import { ocrResults } from './ocr-results';
import { materialSummaries } from './material-summaries';
import { learningHistories } from './learning-histories';
import { downloads } from './downloads';

// ── Auth user relations ──
export const usersRelations = relations(user, ({ many }) => ({
	notifications: many(notifications),
	subjects: many(subjects),
	materials: many(materials),
	bookmarks: many(bookmarks),
	learningHistories: many(learningHistories),
	downloads: many(downloads)
}));

// ── Subjects relations ──
export const subjectsRelations = relations(subjects, ({ one, many }) => ({
	user: one(user, { fields: [subjects.userId], references: [user.id] }),
	materials: many(materials),
	meetings: many(meetings),
	notes: many(notes)
}));

// ── Meetings relations ──
export const meetingsRelations = relations(meetings, ({ one, many }) => ({
	subject: one(subjects, { fields: [meetings.subjectId], references: [subjects.id] }),
	materials: many(materials)
}));

// ── Materials relations ──
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

// ── Notes relations ──
export const notesRelations = relations(notes, ({ one }) => ({
	material: one(materials, { fields: [notes.materialId], references: [materials.id] }),
	subject: one(subjects, { fields: [notes.subjectId], references: [subjects.id] }),
	user: one(user, { fields: [notes.userId], references: [user.id] })
}));

// ── Bookmarks relations ──
export const bookmarksRelations = relations(bookmarks, ({ one }) => ({
	material: one(materials, { fields: [bookmarks.materialId], references: [materials.id] }),
	user: one(user, { fields: [bookmarks.userId], references: [user.id] })
}));

// ── Notifications relations ──
export const notificationsRelations = relations(notifications, ({ one }) => ({
	user: one(user, { fields: [notifications.userId], references: [user.id] })
}));

// ── OCR Results relations ──
export const ocrResultsRelations = relations(ocrResults, ({ one }) => ({
	material: one(materials, { fields: [ocrResults.materialId], references: [materials.id] })
}));

// ── Material Summaries relations ──
export const materialSummariesRelations = relations(materialSummaries, ({ one }) => ({
	material: one(materials, { fields: [materialSummaries.materialId], references: [materials.id] })
}));

// ── Learning Histories relations ──
export const learningHistoriesRelations = relations(learningHistories, ({ one }) => ({
	material: one(materials, { fields: [learningHistories.materialId], references: [materials.id] }),
	user: one(user, { fields: [learningHistories.userId], references: [user.id] })
}));

// ── Downloads relations ──
export const downloadsRelations = relations(downloads, ({ one }) => ({
	material: one(materials, { fields: [downloads.materialId], references: [materials.id] }),
	user: one(user, { fields: [downloads.userId], references: [user.id] })
}));
