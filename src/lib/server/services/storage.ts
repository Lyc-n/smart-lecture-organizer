import { db } from '$lib/server/db';
import { items, users } from '$lib/server/db/schema';
import { eq, sql } from 'drizzle-orm';

const DEFAULT_STORAGE_LIMIT = 52428800;

export async function getStorageUsed(userId: string): Promise<number> {
	const result = await db
		.select({ total: sql<number>`COALESCE(SUM(${items.fileSize}), 0)` })
		.from(items)
		.where(eq(items.userId, userId));

	return result[0]?.total ?? 0;
}

export async function checkStorageQuota(
	userId: string,
	additionalBytes: number
): Promise<{ allowed: boolean; used: number; limit: number }> {
	const [used, user] = await Promise.all([
		getStorageUsed(userId),
		db
			.select({ storageLimit: users.storageLimit })
			.from(users)
			.where(eq(users.id, userId))
			.then((r) => r[0])
	]);

	const limit = user?.storageLimit ?? DEFAULT_STORAGE_LIMIT;

	return {
		allowed: used + additionalBytes <= limit,
		used,
		limit
	};
}

export async function enforceQuota(userId: string, fileSize: number): Promise<void> {
	const { allowed, used, limit } = await checkStorageQuota(userId, fileSize);
	if (!allowed) {
		throw new Error(`Storage quota exceeded: ${used} + ${fileSize} > ${limit}`);
	}
}
