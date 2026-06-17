import { notifications } from '../db/schema';
import { createRepository } from './base';
import { db } from '../db';
import { eq, desc } from 'drizzle-orm';

const base = createRepository<typeof notifications.$inferSelect, typeof notifications.$inferInsert>(notifications);

/** Repository untuk tabel `notifications` — CRUD standar + mark as read. */
export const NotificationRepository = {
	...base,

	/** Ambil semua notifikasi milik user, diurutkan dari terbaru. */
	async findByUserId(userId: string) {
		return db
			.select()
			.from(notifications)
			.where(eq(notifications.userId, userId))
			.orderBy(desc(notifications.created_at));
	},

	/** Tandai satu notifikasi sebagai sudah dibaca. */
	async markAsRead(id: string) {
		const [result] = await db
			.update(notifications)
			.set({ isRead: true })
			.where(eq(notifications.id, id))
			.returning();
		return result;
	},

	/** Tandai semua notifikasi milik user sebagai sudah dibaca. */
	async markAllAsRead(userId: string) {
		const result = await db
			.update(notifications)
			.set({ isRead: true })
			.where(eq(notifications.userId, userId))
			.returning();
		return result;
	}
};
