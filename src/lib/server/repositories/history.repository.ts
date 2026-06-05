import { eq } from 'drizzle-orm';
import { db } from '../db';
import { learningHistories } from '../db/schema';

export const HistoryRepository = {
	async findByUserId(userId: string) {
		return await db.query.learningHistories.findMany({
			where: eq(learningHistories.userId, userId),
			orderBy: (history, { desc }) => [desc(history.viewedAt)]
		});
	},

	async log(data: { userId: string; materialId: string }) {
		return await db.insert(learningHistories).values(data).returning();
	}
};
