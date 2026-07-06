import { requireSession } from '$lib/server/auth/session';
import { db } from '$lib/server/db';
import { items, itemGroups, groups } from '$lib/server/db/schema';
import { json, error } from '@sveltejs/kit';
import { and, eq, inArray } from 'drizzle-orm';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async (event) => {
	const session = await requireSession(event.request);

	const itemId = event.params.id;

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

	const body = await event.request.json();
	const groupIds: string[] = body.groupIds ?? [];

	if (groupIds.length > 0) {
		const validGroups = await db
			.select({ id: groups.id })
			.from(groups)
			.where(and(eq(groups.userId, session.user.id), inArray(groups.id, groupIds)));

		const validIds = new Set(validGroups.map((g) => g.id));
		const invalidIds = groupIds.filter((id) => !validIds.has(id));
		if (invalidIds.length > 0) {
			error(400, `Invalid group IDs: ${invalidIds.join(', ')}`);
		}
	}

	await db.transaction(async (tx) => {
		await tx.delete(itemGroups).where(eq(itemGroups.itemId, itemId));

		if (groupIds.length > 0) {
			await tx.insert(itemGroups).values(
				groupIds.map((groupId) => ({ itemId, groupId }))
			);
		}
	});

	return json({ success: true });
};
