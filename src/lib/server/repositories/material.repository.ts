import { eq } from 'drizzle-orm';
import { db } from '../db';
import { materials } from '../db/schema';

type newMaterial = typeof materials.$inferInsert;
type updateMaterial = Partial<newMaterial>;

export const MaterialRepository = {
	// Find all materials
	async findAll() {
		return await db.query.materials.findMany();
	},

	// Find by ID
	async findById(id: string) {
		return await db.query.materials.findFirst({
			where: eq(materials.id, id)
		});
	},

	// Find all materials inside a specific Meeting
	async findByMeetingId(meetingId: string) {
		return await db.query.materials.findMany({
			where: eq(materials.meetingId, meetingId)
		});
	},

	// Find all materials inside a specific Subject
	async findBySubjectId(subjectId: string) {
		return await db.query.materials.findMany({
			where: eq(materials.subjectId, subjectId)
		});
	},

	// Create new material
	async create(material: newMaterial) {
		return await db.insert(materials).values(material).returning();
	},

	// Update material metadata
	async update(id: string, updates: updateMaterial) {
		return await db.update(materials).set(updates).where(eq(materials.id, id)).returning();
	},

	// Delete material
	async delete(id: string) {
		return await db.delete(materials).where(eq(materials.id, id)).returning();
	},

	// Search materials
	async search(id: string, keyword: string) {
		return db.query.materials.findMany({
			where: (material, { and, or, ilike }) =>
				and(
					eq(material.uploadedBy, id),
					or(
						ilike(material.title, `%${keyword}%`),
						ilike(material.description, `%${keyword}%`),
						ilike(material.fileName, `%${keyword}%`)
					)
				)
		});
	}
};
