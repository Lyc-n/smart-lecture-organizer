import { meetings } from '../db/schema';
import { createRepository } from './base';
import { db } from '../db';
import { eq } from 'drizzle-orm';

const base = createRepository<typeof meetings.$inferSelect, typeof meetings.$inferInsert>(meetings);

/** Repository untuk tabel `meetings` — CRUD standar + query by subjectId. */
export const MeetingRepository = {
	...base,

	/** Ambil semua meeting dalam suatu subject. */
	async findBySubjectId(subjectId: string) {
		return db.select().from(meetings).where(eq(meetings.subjectId, subjectId));
	}
};
