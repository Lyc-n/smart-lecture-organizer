import { requireSession } from '$lib/server/auth/session';
import { db } from '$lib/server/db';
import { groups } from '$lib/server/db/schema';
import { json, error } from '@sveltejs/kit';
import { eq, asc, sql } from 'drizzle-orm';
import type { RequestHandler } from './$types';

const HEX_COLOR = /^#[0-9a-fA-F]{6}$/;

const VALID_ICONS = [
	'folder', 'book', 'graduation-cap', 'calculator', 'flask',
	'globe', 'music', 'image', 'file-text', 'video',
	'code', 'pen-tool', 'bar-chart', 'heart', 'star',
	'archive', 'briefcase', 'compass', 'cpu', 'database'
];

async function getGroupOrThrow(id: string, userId: string) {
	const group = await db
		.select()
		.from(groups)
		.where(eq(groups.id, id))
		.then((r) => r[0]);

	if (!group) {
		error(404, 'Group not found');
	}
	if (group.userId !== userId) {
		error(403, 'Forbidden');
	}
	return group;
}

function validatePatchBody(body: unknown) {
	if (!body || typeof body !== 'object') {
		error(400, 'Invalid request body');
	}

	const data = body as Record<string, unknown>;
	const updates: Record<string, unknown> = {};

	if (data.name !== undefined) {
		if (typeof data.name !== 'string' || data.name.trim().length === 0) {
			error(400, 'Name cannot be empty');
		}
		updates.name = data.name.trim();
	}

	if (data.color !== undefined) {
		if (typeof data.color !== 'string' || (data.color !== '#6366f1' && !HEX_COLOR.test(data.color))) {
			error(400, 'Invalid color format (expected hex, e.g. #6366f1)');
		}
		updates.color = data.color;
	}

	if (data.icon !== undefined) {
		if (typeof data.icon !== 'string' || !VALID_ICONS.includes(data.icon)) {
			error(400, `Invalid icon. Valid icons: ${VALID_ICONS.join(', ')}`);
		}
		updates.icon = data.icon;
	}

	if (data.subtitle !== undefined) {
		updates.subtitle = typeof data.subtitle === 'string' ? data.subtitle.trim() || null : null;
	}

	if (data.description !== undefined) {
		updates.description = typeof data.description === 'string' ? data.description.trim() || null : null;
	}

	if (data.parent_id !== undefined) {
		updates.parentId = data.parent_id === null ? null : data.parent_id;
	}

	return updates;
}

export const GET: RequestHandler = async (event) => {
	const session = await requireSession(event.request);

	const group = await getGroupOrThrow(event.params.id, session.user.id);

	const children = await db.execute<typeof groups.$inferSelect>(sql`
		WITH RECURSIVE descendants AS (
			SELECT * FROM ${groups} WHERE parent_id = ${group.id}
			UNION ALL
			SELECT g.* FROM ${groups} g
			JOIN descendants d ON g.parent_id = d.id
		)
		SELECT * FROM descendants
		ORDER BY sort_order, name
	`);

	return json({ group, children: children.rows });
};

export const PATCH: RequestHandler = async (event) => {
	const session = await requireSession(event.request);

	const group = await getGroupOrThrow(event.params.id, session.user.id);
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

	return json(updated);
};

export const DELETE: RequestHandler = async (event) => {
	const session = await requireSession(event.request);

	await getGroupOrThrow(event.params.id, session.user.id);

	await db.delete(groups).where(eq(groups.id, event.params.id));

	return json(null, { status: 204 });
};
