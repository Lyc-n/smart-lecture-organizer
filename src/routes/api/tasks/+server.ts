import { auth } from '$lib/server/auth';
import { db } from '$lib/server/db';
import { tasks, groups, items } from '$lib/server/db/schema';
import { json, error } from '@sveltejs/kit';
import { eq, and, asc, lte, gte, sql } from 'drizzle-orm';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async (event) => {
	const session = await auth.api.getSession({
		headers: event.request.headers
	});

	if (!session) {
		error(401, 'Unauthorized');
	}

	const url = new URL(event.request.url);
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

	const userTasks = await db
		.select()
		.from(tasks)
		.where(and(...conditions))
		.orderBy(asc(tasks.sortOrder), asc(tasks.createdAt));

	return json(userTasks);
};

export const POST: RequestHandler = async (event) => {
	const session = await auth.api.getSession({
		headers: event.request.headers
	});

	if (!session) {
		error(401, 'Unauthorized');
	}

	const body = await event.request.json();

	if (!body.title || typeof body.title !== 'string' || body.title.trim().length === 0) {
		error(400, 'Title is required');
	}

	const title = body.title.trim();
	const description = typeof body.description === 'string' ? body.description.trim() || null : null;
	const groupId = typeof body.group_id === 'string' ? body.group_id : null;
	const itemId = typeof body.item_id === 'string' ? body.item_id : null;
	const deadline = typeof body.deadline === 'string' ? new Date(body.deadline) : null;

	if (groupId) {
		const group = await db
			.select({ id: groups.id, userId: groups.userId })
			.from(groups)
			.where(eq(groups.id, groupId))
			.then((r) => r[0]);

		if (!group) {
			error(404, 'Group not found');
		}
		if (group.userId !== session.user.id) {
			error(403, 'Group does not belong to you');
		}
	}

	if (itemId) {
		const item = await db
			.select({ id: items.id, userId: items.userId })
			.from(items)
			.where(eq(items.id, itemId))
			.then((r) => r[0]);

		if (!item) {
			error(404, 'Item not found');
		}
		if (item.userId !== session.user.id) {
			error(403, 'Item does not belong to you');
		}
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

	return json(created, { status: 201 });
};
