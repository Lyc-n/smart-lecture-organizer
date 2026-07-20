import { requireSession } from '$lib/server/auth/session';
import { db } from '$lib/server/db';
import { tasks, groups, items } from '$lib/server/db/schema';
import { getOrThrow, invalidateUserCache } from '$lib/server/db/helpers';
import { parsePagination, getOffset, MAX_PAGE_SIZE } from '$lib/server/pagination';
import { parseCreateTask } from '$lib/server/validators/task';
import { json } from '@sveltejs/kit';
import { eq, and, asc, lte, gte, sql } from 'drizzle-orm';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async (event) => {
	const session = await requireSession(event.request);

	const url = new URL(event.request.url);
	const { page, limit } = parsePagination(url);
	const groupId = url.searchParams.get('groupId');
	const itemId = url.searchParams.get('itemId');
	const completed = url.searchParams.get('completed');
	const deadlineBefore = url.searchParams.get('deadlineBefore');
	const deadlineAfter = url.searchParams.get('deadlineAfter');

	const conditions = [eq(tasks.userId, session.user.id)];

	if (groupId) {
		conditions.push(eq(tasks.groupId, groupId));
	}
	if (itemId) {
		conditions.push(eq(tasks.itemId, itemId));
	}
	if (completed === 'true') {
		conditions.push(eq(tasks.isCompleted, true));
	} else if (completed === 'false') {
		conditions.push(eq(tasks.isCompleted, false));
	}
	if (deadlineBefore) {
		conditions.push(lte(tasks.deadline, new Date(deadlineBefore)));
	}
	if (deadlineAfter) {
		conditions.push(gte(tasks.deadline, new Date(deadlineAfter)));
	}

	const offset = getOffset(page, limit);

	const [data, countResult] = await Promise.all([
		db
			.select()
			.from(tasks)
			.where(and(...conditions))
			.orderBy(asc(tasks.sortOrder), asc(tasks.createdAt))
			.limit(limit)
			.offset(offset),
		db
			.select({ count: sql<number>`COUNT(*)` })
			.from(tasks)
			.where(and(...conditions))
			.then((r) => Number(r[0]?.count ?? 0))
	]);

	return json({
		data,
		total: countResult,
		page,
		limit,
		hasMore: offset + limit < countResult
	});
};

export const POST: RequestHandler = async (event) => {
	const session = await requireSession(event.request);

	const body = await event.request.json();
	const { title, description, groupId, itemId, deadline } = parseCreateTask(body);

	if (groupId) {
		await getOrThrow(groups, groupId, session.user.id);
	}

	if (itemId) {
		await getOrThrow(items, itemId, session.user.id);
	}

	const [created] = await db
		.insert(tasks)
		.values({
			userId: session.user.id,
			title,
			description,
			groupId,
			itemId,
			deadline
		})
		.returning();

	invalidateUserCache(session.user.id);

	return json(created, { status: 201 });
};
