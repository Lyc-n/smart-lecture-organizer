import { eq } from 'drizzle-orm';
import { db } from '../db';
import { notes } from '../db/schema';

export const NoteRepository = {
	async findByMaterialId(materialId: string) {
		return await db.query.notes.findMany({
			where: eq(notes.materialId, materialId)
		});
	},

	async create(data: { materialId: string; userId: string; content: string }) {
		return await db.insert(notes).values(data).returning();
	},

	async update(id: string, content: string) {
		return await db.update(notes).set({ content }).where(eq(notes.id, id)).returning();
	},

	async delete(id: string) {
		return await db.delete(notes).where(eq(notes.id, id)).returning();
	}
};
