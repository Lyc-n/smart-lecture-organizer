import { bookmarks } from '../db/schema';
import { createRepository } from './base';
import { db } from '../db';
import { and, eq } from 'drizzle-orm';

const base = createRepository<typeof bookmarks.$inferSelect, typeof bookmarks.$inferInsert>(bookmarks);

/** Repository untuk tabel `bookmarks` — CRUD standar + create/remove by userId & materialId. */
export const BookmarkRepository = {
	...base,

	/** Bookmark suatu material oleh user. */
	async create(userId: string, materialId: string) {
		const [row] = await db.insert(bookmarks).values({ userId, materialId }).returning();
		return row;
	},

	/** Ambil semua bookmark milik user berikut detail material. */
	async findByUserId(userId: string) {
		return db.query.bookmarks.findMany({
			where: eq(bookmarks.userId, userId),
			with: { material: true }
		});
	},

	/** Hapus bookmark tertentu milik user. */
	async remove(userId: string, materialId: string) {
		const [result] = await db
			.delete(bookmarks)
			.where(and(eq(bookmarks.userId, userId), eq(bookmarks.materialId, materialId)))
			.returning();
		return result;
	}
};
