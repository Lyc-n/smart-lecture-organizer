import { requireSession } from '$lib/server/auth/session';
import { db } from '$lib/server/db';
import { tasks } from '$lib/server/db/schema';
import { getOrThrow, invalidateUserCache } from '$lib/server/db/helpers';
import { parseUpdateTask } from '$lib/server/validators/task';
import { json } from '@sveltejs/kit';
import { eq, sql } from 'drizzle-orm';
import type { RequestHandler } from './$types';

export const PATCH: RequestHandler = async (event) => {
	const session = await requireSession(event.request);

	const task = await getOrThrow(tasks, event.params.id, session.user.id);
	const body = await event.request.json();
	const updates = parseUpdateTask(body);

	if (updates.is_completed !== undefined) {
		updates.completedAt = updates.is_completed ? sql`NOW()` : null;
	}

	updates.updatedAt = sql`NOW()`;

	const [updated] = await db
		.update(tasks)
		.set(updates)
		.where(eq(tasks.id, task.id))
		.returning();

	invalidateUserCache(session.user.id);

	return json(updated);
};

export const DELETE: RequestHandler = async (event) => {
	const session = await requireSession(event.request);

	await getOrThrow(tasks, event.params.id, session.user.id);

	await db.delete(tasks).where(eq(tasks.id, event.params.id));

	invalidateUserCache(session.user.id);

	return json(null, { status: 204 });
};
