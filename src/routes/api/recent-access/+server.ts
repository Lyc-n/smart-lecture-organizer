import { auth } from '$lib/server/auth';
import { db } from '$lib/server/db';
import { recentAccess } from '$lib/server/db/schema';
import { json, error } from '@sveltejs/kit';
import { eq, and, inArray, sql } from 'drizzle-orm';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async (event) => {
	const session = await auth.api.getSession({
		headers: event.request.headers
	});

	if (!session) {
		error(401, 'Unauthorized');
	}

	const body = await event.request.json();
	const itemId = typeof body.item_id === 'string' ? body.item_id : null;
	const groupId = typeof body.group_id === 'string' ? body.group_id : null;

	if (!itemId && !groupId) {
		error(400, 'Must provide item_id or group_id');
	}
	if (itemId && groupId) {
		error(400, 'Provide only one of item_id or group_id');
	}

	const userId = session.user.id;

	await db.transaction(async (tx) => {
		const condition = itemId
			? and(eq(recentAccess.userId, userId), eq(recentAccess.itemId, itemId))
			: and(eq(recentAccess.userId, userId), eq(recentAccess.groupId, groupId!));

		const existing = await tx
			.select({ id: recentAccess.id })
			.from(recentAccess)
			.where(condition)
			.then((r) => r[0]);

		if (existing) {
			await tx
				.update(recentAccess)
				.set({ accessedAt: sql`NOW()` })
				.where(eq(recentAccess.id, existing.id));
		} else {
			await tx.insert(recentAccess).values({
				userId,
				itemId,
				groupId
			});
		}

		const count = await tx
			.select({ total: sql<number>`COUNT(*)` })
			.from(recentAccess)
			.where(eq(recentAccess.userId, userId))
			.then((r) => Number(r[0]?.total ?? 0));

		if (count > 50) {
			const toDelete = await tx
				.select({ id: recentAccess.id })
				.from(recentAccess)
				.where(eq(recentAccess.userId, userId))
				.orderBy(sql`${recentAccess.accessedAt} ASC`)
				.limit(count - 50);

			if (toDelete.length > 0) {
				await tx.delete(recentAccess).where(
					inArray(recentAccess.id, toDelete.map((r) => r.id))
				);
			}
		}
	});

	return json({ success: true });
};
