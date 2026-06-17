import { materials } from '../db/schema';
import { createRepository } from './base';
import { db } from '../db';
import { eq, or, ilike, and } from 'drizzle-orm';

const base = createRepository<typeof materials.$inferSelect, typeof materials.$inferInsert>(materials);

/** Repository untuk tabel `materials` — CRUD standar + query & search. */
export const MaterialRepository = {
	...base,

	/** Ambil semua material dalam suatu meeting. */
	async findByMeetingId(meetingId: string) {
		return db.select().from(materials).where(eq(materials.meetingId, meetingId));
	},

	/** Ambil semua material dalam suatu subject. */
	async findBySubjectId(subjectId: string) {
		return db.select().from(materials).where(eq(materials.subjectId, subjectId));
	},

	/** Ambil semua material milik user, berikut relasi subject. */
	async findByUploadedBy(userId: string) {
		return db.query.materials.findMany({
			where: eq(materials.uploadedBy, userId),
			with: { subject: true },
			orderBy: (materials, { desc }) => [desc(materials.createdAt)]
		});
	},

	/** Cari material milik user berdasarkan keyword (title/description/fileName). */
	async search(userId: string, keyword: string) {
		return db
			.select()
			.from(materials)
			.where(
				and(
					eq(materials.uploadedBy, userId),
					or(
						ilike(materials.title, `%${keyword}%`),
						ilike(materials.description, `%${keyword}%`),
						ilike(materials.fileName, `%${keyword}%`)
					)
				)
			);
	}
};
