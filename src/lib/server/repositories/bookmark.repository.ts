import { and, eq } from 'drizzle-orm';
import { db } from '../db';
import { bookmarks } from '../db/schema';

export const BookmarkRepository = {
	async findByUserId(userId: string) {
		return await db.query.bookmarks.findMany({
			where: eq(bookmarks.userId, userId)
		});
	},

	async add(data: { userId: string; materialId: string }) {
		return await db.insert(bookmarks).values(data).returning();
	},

	async remove(userId: string, materialId: string) {
		return await db
			.delete(bookmarks)
			.where(and(eq(bookmarks.userId, userId), eq(bookmarks.materialId, materialId)))
			.returning();
	}
};
