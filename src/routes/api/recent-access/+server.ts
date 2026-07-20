import { requireSession } from '$lib/server/auth/session';
import { db } from '$lib/server/db';
import { recentAccess } from '$lib/server/db/schema';
import { parseTargetId, validateMutualExclusion } from '$lib/server/validators/target';
import { json } from '@sveltejs/kit';
import { eq, and, inArray, sql } from 'drizzle-orm';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async (event) => {
	const session = await requireSession(event.request);

	const body = await event.request.json();
	const { itemId, groupId } = parseTargetId(body);
	validateMutualExclusion(itemId, groupId);

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
