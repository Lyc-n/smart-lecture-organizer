import { subjects } from '../db/schema';
import { createRepository } from './base';
import { db } from '../db';
import { eq } from 'drizzle-orm';

const base = createRepository<typeof subjects.$inferSelect, typeof subjects.$inferInsert>(subjects);

/** Repository untuk tabel `subjects` — CRUD standar + query by userId. */
export const SubjectRepository = {
	...base,

	/** Ambil semua subject milik user tertentu. */
	async findByUserId(userId: string) {
		return db.select().from(subjects).where(eq(subjects.userId, userId));
	}
};
