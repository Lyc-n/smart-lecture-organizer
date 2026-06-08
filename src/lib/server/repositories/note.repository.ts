import { eq } from 'drizzle-orm';
import { db } from '../db';
import { notes } from '../db/schema';

export const NoteRepository = {
	async findById(id: string) {
		return await db.query.notes.findFirst({
			where: eq(notes.id, id),
			with: { subject: true }
		});
	},

	async findByMaterialId(materialId: string) {
		return await db.query.notes.findMany({
			where: eq(notes.materialId, materialId),
			with: { subject: true }
		});
	},

	async findByUserId(userId: string) {
		return await db.query.notes.findMany({
			where: eq(notes.userId, userId),
			with: { subject: true },
			orderBy: (notes, { desc }) => [desc(notes.updatedAt)]
		});
	},

	async create(data: {
		userId: string;
		content: string;
		title?: string;
		materialId?: string | null;
		subjectId?: string | null;
	}) {
		return await db.insert(notes).values(data).returning();
	},

	async update(
		id: string,
		updates: { content?: string; title?: string; subjectId?: string | null }
	) {
		return await db
			.update(notes)
			.set({ ...updates, updatedAt: new Date() })
			.where(eq(notes.id, id))
			.returning();
	},

	async delete(id: string) {
		return await db.delete(notes).where(eq(notes.id, id)).returning();
	}
};
