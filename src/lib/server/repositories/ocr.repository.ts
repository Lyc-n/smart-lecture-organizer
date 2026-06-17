import { ocrResults } from '../db/schema';
import { createRepository } from './base';
import { db } from '../db';
import { eq } from 'drizzle-orm';

const base = createRepository<typeof ocrResults.$inferSelect, typeof ocrResults.$inferInsert>(ocrResults);

/** Repository untuk tabel `ocr_results` — CRUD standar + query by materialId. */
export const OcrRepository = {
	...base,

	/** Ambil hasil OCR untuk suatu material (max 1). */
	async findByMaterialId(materialId: string) {
		const [result] = await db
			.select()
			.from(ocrResults)
			.where(eq(ocrResults.materialId, materialId))
			.limit(1);
		return result ?? null;
	},

	/** Hapus semua hasil OCR untuk suatu material. */
	async deleteByMaterialId(materialId: string) {
		const [result] = await db
			.delete(ocrResults)
			.where(eq(ocrResults.materialId, materialId))
			.returning();
		return result;
	}
};
