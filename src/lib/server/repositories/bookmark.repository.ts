import { and, eq } from 'drizzle-orm';
import { db } from '../db';
import { bookmarks } from '../db/schema';

export const BookmarkRepository = {
	async create(userId: string, materialId: string) {
		const [bookmark] = await db.insert(bookmarks).values({ userId, materialId }).returning();
		return bookmark;
	},

	async findByUserId(userId: string) {
		return db.query.bookmarks.findMany({
			where:(bookmark, {eq}) => eq(bookmark.userId, userId), with: { material: true }
		});
	},

	async add(data: { userId: string; materialId: string }) {
		return await db.insert(bookmarks).values(data).returning();
	},

	async remove(userId: string, materialId: string) {
		return db
			.delete(bookmarks)
			.where(and(eq(bookmarks.userId, userId), eq(bookmarks.materialId, materialId)))
			.returning();
	}
};
