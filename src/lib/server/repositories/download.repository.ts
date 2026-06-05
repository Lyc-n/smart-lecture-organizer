import { eq } from 'drizzle-orm';
import { db } from '../db';
import { downloads } from '../db/schema';

export const DownloadRepository = {
	async findByUserId(userId: string) {
		return await db.query.downloads.findMany({
			where: eq(downloads.userId, userId)
		});
	},

	async findByMaterialId(materialId: string) {
		return await db.query.downloads.findMany({
			where: eq(downloads.materialId, materialId)
		});
	},

	async log(data: { userId: string; materialId: string }) {
		return await db.insert(downloads).values(data).returning();
	}
};
