import { materialSummaries } from '../db/schema';
import { createRepository } from './base';
import { db } from '../db';
import { eq } from 'drizzle-orm';

const base = createRepository<typeof materialSummaries.$inferSelect, typeof materialSummaries.$inferInsert>(materialSummaries);

/** Repository untuk tabel `material_summaries` — CRUD standar + cari by materialId. */
export const SummaryRepository = {
	...base,

	/** Ambil ringkasan untuk suatu material (max 1). */
	async findByMaterialId(materialId: string) {
		const [result] = await db
			.select()
			.from(materialSummaries)
			.where(eq(materialSummaries.materialId, materialId))
			.limit(1);
		return result ?? null;
	}
};
