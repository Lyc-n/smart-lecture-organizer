import { eq } from 'drizzle-orm';
import { db } from '../db';
import { ocrResults } from '../db/schema';

export const OcrRepository = {
	async findByMaterialId(materialId: string) {
		return await db.query.ocrResults.findFirst({
			where: eq(ocrResults.materialId, materialId)
		});
	},

	async create(data: { materialId: string; extractedText: string }) {
		return await db.insert(ocrResults).values(data).returning();
	},

	async deleteByMaterialId(materialId: string) {
		return await db.delete(ocrResults).where(eq(ocrResults.materialId, materialId)).returning();
	}
};
