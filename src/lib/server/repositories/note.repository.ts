import { notes } from '../db/schema';
import { createRepository } from './base';
import { db } from '../db';
import { eq, desc } from 'drizzle-orm';

const base = createRepository<typeof notes.$inferSelect, typeof notes.$inferInsert>(notes);

/** Repository untuk tabel `notes` — CRUD standar + query by relasi. */
export const NoteRepository = {
	...base,

	/** Ambil note berikut relasi subject. */
	async findById(id: string) {
		return db.query.notes.findFirst({
			where: eq(notes.id, id),
			with: { subject: true }
		});
	},

	/** Ambil semua note dalam suatu material. */
	async findByMaterialId(materialId: string) {
		return db.query.notes.findMany({
			where: eq(notes.materialId, materialId),
			with: { subject: true }
		});
	},

	/** Ambil semua note milik user, diurutkan berdasarkan update terakhir. */
	async findByUserId(userId: string) {
		return db.query.notes.findMany({
			where: eq(notes.userId, userId),
			with: { subject: true },
			orderBy: (notes, { desc }) => [desc(notes.updatedAt)]
		});
	},

	/** Update note — otomatis set `updatedAt`. */
	async update(id: string, updates: { content?: string; title?: string; subjectId?: string | null }) {
		const [result] = await db
			.update(notes)
			.set({ ...updates, updatedAt: new Date() })
			.where(eq(notes.id, id))
			.returning();
		return result;
	}
};
