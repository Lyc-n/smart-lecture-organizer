import { eq } from 'drizzle-orm';
import { db } from '../db';
import { notifications } from '../db/schema';

export const NotificationRepository = {
	async findByUserId(userId: string) {
		return await db.query.notifications.findMany({
			where: eq(notifications.userId, userId),
			orderBy: (notifications, { desc }) => [desc(notifications.created_at)]
		});
	},

	async create(data: { userId: string; title: string; message: string }) {
		return await db.insert(notifications).values(data).returning();
	},

	async markAsRead(id: string) {
		return await db
			.update(notifications)
			.set({ isRead: true })
			.where(eq(notifications.id, id))
			.returning();
	},

	async markAllAsRead(userId: string) {
		return await db
			.update(notifications)
			.set({ isRead: true })
			.where(eq(notifications.userId, userId))
			.returning();
	}
};
