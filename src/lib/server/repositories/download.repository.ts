import { downloads } from '../db/schema';
import { createRepository } from './base';
import { db } from '../db';
import { eq } from 'drizzle-orm';

const base = createRepository<typeof downloads.$inferSelect, typeof downloads.$inferInsert>(downloads);

/** Repository untuk tabel `downloads` — CRUD standar + query by userId/materialId. */
export const DownloadRepository = {
	...base,

	/** Ambil semua download milik user. */
	async findByUserId(userId: string) {
		return db.select().from(downloads).where(eq(downloads.userId, userId));
	},

	/** Ambil semua download untuk suatu material. */
	async findByMaterialId(materialId: string) {
		return db.select().from(downloads).where(eq(downloads.materialId, materialId));
	}
};
