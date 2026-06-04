import { eq } from 'drizzle-orm';
import { db } from '../db';
import { materialSummaries } from '../db/schema';

export const SummaryRepository = {
	async findByMaterialId(materialId: string) {
		return await db.query.materialSummaries.findFirst({
			where: eq(materialSummaries.materialId, materialId)
		});
	},

	async create(data: { materialId: string; summaryText: string }) {
		return await db.insert(materialSummaries).values(data).returning();
	},

	async delete(id: string) {
		return await db.delete(materialSummaries).where(eq(materialSummaries.id, id)).returning();
	}
};
