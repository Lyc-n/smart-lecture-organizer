import { eq } from 'drizzle-orm';
import { db } from '../db';
import { materials } from '../db/schema';

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

	// Create new material
	async create(material: {
		meetingId: string;
		uploadedBy: string;
		title: string;
		description?: string | null;
		blobPath: string;
		fileName: string;
		mimeType: string;
		fileSize: number;
	}) {
		return await db.insert(materials).values(material).returning();
	},

	// Update material metadata
	async update(
		id: string,
		updates: {
			title?: string;
			description?: string | null;
			fileName?: string;
			mimeType?: string;
			fileSize?: number;
		}
	) {
		return await db.update(materials).set(updates).where(eq(materials.id, id)).returning();
	},

	// Delete material
	async delete(id: string) {
		return await db.delete(materials).where(eq(materials.id, id)).returning();
	},

	// Search materials
	search(keyword: string) {
		return db.query.materials.findMany({
			where: (material, { or, like }) =>
				or(
					like(material.title, `%${keyword}%`),
					like(material.description, `%${keyword}%`),
					like(material.fileName, `%${keyword}%`)
				)
		});
	}
};
