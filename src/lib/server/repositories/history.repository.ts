import { learningHistories } from '../db/schema';
import { createRepository } from './base';
import { db } from '../db';
import { eq, desc } from 'drizzle-orm';

const base = createRepository<typeof learningHistories.$inferSelect, typeof learningHistories.$inferInsert>(learningHistories);

/** Repository untuk tabel `learning_histories` — CRUD standar + query by userId. */
export const HistoryRepository = {
	...base,

	/** Ambil riwayat belajar milik user, diurutkan dari yang terbaru dilihat. */
	async findByUserId(userId: string) {
		return db
			.select()
			.from(learningHistories)
			.where(eq(learningHistories.userId, userId))
			.orderBy(desc(learningHistories.viewedAt));
	}
};
