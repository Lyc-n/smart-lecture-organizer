/* eslint-disable @typescript-eslint/no-explicit-any */
import { db } from '$lib/server/db';
import { error } from '@sveltejs/kit';
import { eq, sql } from 'drizzle-orm';
import { cached, cache } from '$lib/server/cache';
import { getOffset, type PaginatedResult, DEFAULT_PAGE_SIZE } from '$lib/server/pagination';
import { validateUUID } from '$lib/server/validators/common';

type AnyPgTable = { id: any; [key: string]: any };

export async function getOrThrow(
	table: AnyPgTable,
	id: string,
	userId: string
): Promise<any> {
	validateUUID(id);

	const record = await (db.select().from(table as any).where(eq(table.id, id)) as any).then(
		(r: unknown[]) => r[0]
	);

	if (!record) {
		error(404, 'Not found');
	}
	if (record.userId !== userId) {
		error(403, 'Forbidden');
	}
	return record;
}

const MAX_GROUPS_LIMIT = 100;

export async function getUserGroups(userId: string, limit = MAX_GROUPS_LIMIT) {
	return cached(`groups:${userId}:${limit}`, async () => {
		const { groups } = await import('$lib/server/db/schema');
		const { asc } = await import('drizzle-orm');

		return db
			.select()
			.from(groups)
			.where(eq(groups.userId, userId))
			.orderBy(asc(groups.sortOrder), asc(groups.name))
			.limit(limit);
	}, 60_000);
}

export async function getUserGroupCount(userId: string): Promise<number> {
	return cached(`groupCount:${userId}`, async () => {
		const { groups } = await import('$lib/server/db/schema');

		const result = await db
			.select({ count: sql<number>`COUNT(*)` })
			.from(groups)
			.where(eq(groups.userId, userId));

		return Number(result[0]?.count ?? 0);
	}, 60_000);
}

export async function getUserGroupsPaginated(
	userId: string,
	page: number,
	limit: number
): Promise<PaginatedResult<typeof groups.$inferSelect>> {
	const { groups } = await import('$lib/server/db/schema');
	const { asc } = await import('drizzle-orm');

	const offset = getOffset(page, limit);

	const [data, countResult] = await Promise.all([
		db
			.select()
			.from(groups)
			.where(eq(groups.userId, userId))
			.orderBy(asc(groups.sortOrder), asc(groups.name))
			.limit(limit)
			.offset(offset),
		db
			.select({ count: sql<number>`COUNT(*)` })
			.from(groups)
			.where(eq(groups.userId, userId))
			.then((r) => Number(r[0]?.count ?? 0))
	]);

	return {
		data,
		total: countResult,
		page,
		limit,
		hasMore: offset + limit < countResult
	};
}

export async function getGroupDescendants(groupId: string) {
	const { groups } = await import('$lib/server/db/schema');

	return db.execute<typeof groups.$inferSelect>(sql`
		WITH RECURSIVE descendants AS (
			SELECT * FROM ${groups} WHERE parent_id = ${groupId}
			UNION ALL
			SELECT g.* FROM ${groups} g
			JOIN descendants d ON g.parent_id = d.id
		)
		SELECT * FROM descendants
		ORDER BY sort_order, name
		LIMIT 100
	`);
}

export async function getOverdueCount(userId: string): Promise<number> {
	return cached(`overdue:${userId}`, async () => {
		const { tasks } = await import('$lib/server/db/schema');

		const result = await db
			.select({ count: sql<number>`COUNT(*)` })
			.from(tasks)
			.where(
				sql`${tasks.userId} = ${userId} AND ${tasks.isCompleted} = false AND ${tasks.deadline} < NOW() AND ${tasks.deadline} IS NOT NULL`
			);

		return Number(result[0]?.count ?? 0);
	}, 30_000);
}

export async function getUserBookmarks(userId: string, limit = DEFAULT_PAGE_SIZE) {
	return cached(`bookmarks:${userId}:${limit}`, async () => {
		const { bookmarks, items, groups } = await import('$lib/server/db/schema');
		const { eq, desc } = await import('drizzle-orm');

		return db
			.select({
				id: bookmarks.id,
				createdAt: bookmarks.createdAt,
				itemId: bookmarks.itemId,
				groupId: bookmarks.groupId,
				itemName: items.name,
				itemType: items.type,
				itemFileUrl: items.fileUrl,
				groupName: groups.name,
				groupColor: groups.color,
				groupIcon: groups.icon
			})
			.from(bookmarks)
			.leftJoin(items, eq(bookmarks.itemId, items.id))
			.leftJoin(groups, eq(bookmarks.groupId, groups.id))
			.where(eq(bookmarks.userId, userId))
			.orderBy(desc(bookmarks.createdAt))
			.limit(limit);
	}, 30_000);
}

export async function getUserBookmarksPaginated(
	userId: string,
	page: number,
	limit: number
) {
	const { bookmarks, items, groups } = await import('$lib/server/db/schema');
	const { eq, desc } = await import('drizzle-orm');

	const offset = getOffset(page, limit);

	const [data, countResult] = await Promise.all([
		db
			.select({
				id: bookmarks.id,
				createdAt: bookmarks.createdAt,
				itemId: bookmarks.itemId,
				groupId: bookmarks.groupId,
				itemName: items.name,
				itemType: items.type,
				itemFileUrl: items.fileUrl,
				groupName: groups.name,
				groupColor: groups.color,
				groupIcon: groups.icon
			})
			.from(bookmarks)
			.leftJoin(items, eq(bookmarks.itemId, items.id))
			.leftJoin(groups, eq(bookmarks.groupId, groups.id))
			.where(eq(bookmarks.userId, userId))
			.orderBy(desc(bookmarks.createdAt))
			.limit(limit)
			.offset(offset),
		db
			.select({ count: sql<number>`COUNT(*)` })
			.from(bookmarks)
			.where(eq(bookmarks.userId, userId))
			.then((r) => Number(r[0]?.count ?? 0))
	]);

	return {
		data,
		total: countResult,
		page,
		limit,
		hasMore: offset + limit < countResult
	};
}

export function invalidateUserCache(userId: string): void {
	cache.invalidate(`(groups|groupCount|overdue|bookmarks):${userId}`);
}
