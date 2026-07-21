import { requireSession } from '$lib/server/auth/session';
import { db } from '$lib/server/db';
import { groups } from '$lib/server/db/schema';
import { getOrThrow, getGroupDescendants, invalidateUserCache } from '$lib/server/db/helpers';
import { withErrorHandling } from '$lib/server/errors';
import { validatePatchBody } from '$lib/server/validators/group';
import { validateUUID } from '$lib/server/validators/common';
import { json, error } from '@sveltejs/kit';
import { eq, sql } from 'drizzle-orm';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = withErrorHandling(async (event) => {
	const session = await requireSession(event);
	const id = validateUUID(event.params.id);

	const group = await getOrThrow(groups, id, session.user.id);

	const children = await getGroupDescendants(group.id);

	return json({ group, children: children.rows });
});

export const PATCH: RequestHandler = withErrorHandling(async (event) => {
	const session = await requireSession(event);
	const id = validateUUID(event.params.id);

	const group = await getOrThrow(groups, id, session.user.id);
	const body = await event.request.json();
	const updates = validatePatchBody(body);

	if (Object.keys(updates).length === 0) {
		error(400, 'No valid fields to update');
	}

	if (updates.parentId !== undefined) {
		const newParentId = updates.parentId as string | null;

		if (newParentId === group.id) {
			error(400, 'A group cannot be its own parent');
		}

		if (newParentId !== null) {
			const parent = await db
				.select({ id: groups.id, userId: groups.userId })
				.from(groups)
				.where(eq(groups.id, newParentId))
				.then((r) => r[0]);

			if (!parent) {
				error(404, 'Parent group not found');
			}
			if (parent.userId !== session.user.id) {
				error(403, 'Parent group does not belong to you');
			}

			const cycleCheck = await db.execute<{ id: string }>(sql`
				WITH RECURSIVE ancestors AS (
					SELECT * FROM ${groups} WHERE id = ${newParentId}
					UNION ALL
					SELECT g.* FROM ${groups} g
					JOIN ancestors a ON g.id = a.parent_id
				)
				SELECT id FROM ancestors WHERE id = ${group.id}
			`);

			if (cycleCheck.rows.length > 0) {
				error(400, 'Cannot set parent: would create a cycle');
			}
		}
	}

	const [updated] = await db
		.update(groups)
		.set({ ...updates, updatedAt: sql`NOW()` })
		.where(eq(groups.id, group.id))
		.returning();

	invalidateUserCache(session.user.id);

	return json(updated);
});

export const DELETE: RequestHandler = withErrorHandling(async (event) => {
	const session = await requireSession(event);
	const id = validateUUID(event.params.id);

	await getOrThrow(groups, id, session.user.id);

	await db.delete(groups).where(eq(groups.id, id));

	invalidateUserCache(session.user.id);

	return json(null, { status: 204 });
});
