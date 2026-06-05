import { eq } from 'drizzle-orm';
import { db } from '../db';
import { users } from '../db/schema';

export const UserRepository = {
	// Find by ID
	async findById(id: string) {
		return await db.query.users.findFirst({
			where: eq(users.id, id)
		});
	},

	// Find by email
	async findByEmail(email: string) {
		return await db.query.users.findFirst({
			where: eq(users.email, email)
		});
	},

	// Create new user
	async create(user: { name: string; email: string; password: string; role?: string }) {
		return await db.insert(users).values(user).returning();
	},

	// Update user
	async update(
		id: string,
		updates: {
			name?: string;
			email?: string;
			password?: string;
			role?: string;
			isVerified?: boolean;
		}
	) {
		return await db.update(users).set(updates).where(eq(users.id, id)).returning();
	},

	// Delete user
	async delete(id: string) {
		return await db.delete(users).where(eq(users.id, id)).returning();
	}
};
