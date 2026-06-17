import { eq } from 'drizzle-orm';
import { db } from '../db';
import { user } from '../../../../auth-schema';

export const UserRepository = {
	async findById(id: string) {
		const [result] = await db.select().from(user).where(eq(user.id, id)).limit(1);
		return result ?? null;
	},

	async findByEmail(email: string) {
		const [result] = await db.select().from(user).where(eq(user.email, email)).limit(1);
		return result ?? null;
	},

	async update(id: string, updates: { name?: string; image?: string }) {
		const [result] = await db.update(user).set(updates).where(eq(user.id, id)).returning();
		return result;
	}
};
