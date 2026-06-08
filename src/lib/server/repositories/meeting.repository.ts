import { eq } from 'drizzle-orm';
import { db } from '../db';
import { meetings } from '../db/schema';

export const MeetingRepository = {
	async findById(id: string) {
		return await db.query.meetings.findFirst({
			where: eq(meetings.id, id)
		});
	},

	async findBySubjectId(subjectId: string) {
		return await db.query.meetings.findMany({
			where: eq(meetings.subjectId, subjectId)
		});
	},

	async create(data: {
		subjectId?: string | null;
		weekNumber: number;
		title: string;
		description?: string | null;
	}) {
		return await db.insert(meetings).values(data).returning();
	},

	async update(
		id: string,
		updates: { weekNumber?: number; title?: string; description?: string | null }
	) {
		return await db.update(meetings).set(updates).where(eq(meetings.id, id)).returning();
	},

	async delete(id: string) {
		return await db.delete(meetings).where(eq(meetings.id, id)).returning();
	}
};
