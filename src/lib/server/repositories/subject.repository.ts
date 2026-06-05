import { eq } from 'drizzle-orm';
import { db } from '../db';
import { subjects } from '../db/schema';

export const SubjectRepository = {
	// Find all subjects
	async findAll() {
		return await db.query.subjects.findMany();
	},

	// Find by ID
	async findById(id: string) {
		return await db.query.subjects.findFirst({
			where: eq(subjects.id, id)
		});
	},

	// Find all subjects owned by a specific User
	async findByUserId(userId: string) {
		return await db.query.subjects.findMany({
			where: eq(subjects.userId, userId)
		});
	},

	// Create new subject
	async create(subject: { userId: string; name: string; description?: string | null }) {
		return await db.insert(subjects).values(subject).returning();
	},

	// Update subject
	async update(id: string, updates: { name?: string; description?: string | null }) {
		return await db.update(subjects).set(updates).where(eq(subjects.id, id)).returning();
	},

	// Delete subject
	async delete(id: string) {
		return await db.delete(subjects).where(eq(subjects.id, id)).returning();
	}
};
