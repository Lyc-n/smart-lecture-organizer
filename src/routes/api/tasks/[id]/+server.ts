import { auth } from '$lib/server/auth';
import { db } from '$lib/server/db';
import { tasks } from '$lib/server/db/schema';
import { json, error } from '@sveltejs/kit';
import { eq, sql } from 'drizzle-orm';
import type { RequestHandler } from './$types';

async function getTaskOrThrow(id: string, userId: string) {
	const task = await db
		.select()
		.from(tasks)
		.where(eq(tasks.id, id))
		.then((r) => r[0]);

	if (!task) {
		error(404, 'Task not found');
	}
	if (task.userId !== userId) {
		error(403, 'Forbidden');
	}
	return task;
}

export const PATCH: RequestHandler = async (event) => {
	const session = await auth.api.getSession({
		headers: event.request.headers
	});

	if (!session) {
		error(401, 'Unauthorized');
	}

	const task = await getTaskOrThrow(event.params.id, session.user.id);
	const body = await event.request.json();
	const updates: Record<string, unknown> = {};

	if (body.title !== undefined) {
		if (typeof body.title !== 'string' || body.title.trim().length === 0) {
			error(400, 'Title cannot be empty');
		}
		updates.title = body.title.trim();
	}

	if (body.description !== undefined) {
		updates.description = typeof body.description === 'string' ? body.description.trim() || null : null;
	}

	if (body.deadline !== undefined) {
		updates.deadline = body.deadline === null ? null : new Date(body.deadline);
	}

	if (body.is_completed !== undefined) {
		updates.isCompleted = Boolean(body.is_completed);
		updates.completedAt = body.is_completed ? sql`NOW()` : null;
	}

	if (Object.keys(updates).length === 0) {
		error(400, 'No valid fields to update');
	}

	updates.updatedAt = sql`NOW()`;

	const [updated] = await db
		.update(tasks)
		.set(updates)
		.where(eq(tasks.id, task.id))
		.returning();

	return json(updated);
};

export const DELETE: RequestHandler = async (event) => {
	const session = await auth.api.getSession({
		headers: event.request.headers
	});

	if (!session) {
		error(401, 'Unauthorized');
	}

	await getTaskOrThrow(event.params.id, session.user.id);

	await db.delete(tasks).where(eq(tasks.id, event.params.id));

	return json(null, { status: 204 });
};
