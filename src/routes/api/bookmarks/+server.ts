import { requireSession } from '$lib/server/auth/session';
import { db } from '$lib/server/db';
import { bookmarks, items, groups } from '$lib/server/db/schema';
import { getOrThrow, getUserBookmarksPaginated, invalidateUserCache } from '$lib/server/db/helpers';
import { withErrorHandling } from '$lib/server/errors';
import { parsePagination } from '$lib/server/pagination';
import { parseTargetId, validateMutualExclusion } from '$lib/server/validators/target';
import { json } from '@sveltejs/kit';
import { eq, and } from 'drizzle-orm';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = withErrorHandling(async (event) => {
	const session = await requireSession(event);
	const { page, limit } = parsePagination(new URL(event.request.url));

	const result = await getUserBookmarksPaginated(session.user.id, page, limit);

	return json(result);
});

export const POST: RequestHandler = withErrorHandling(async (event) => {
	const session = await requireSession(event);

	const body = await event.request.json();
	const { itemId, groupId } = parseTargetId(body);
	validateMutualExclusion(itemId, groupId);

	if (itemId) {
		await getOrThrow(items, itemId, session.user.id);
	}

	if (groupId) {
		await getOrThrow(groups, groupId, session.user.id);
	}

	const existing = await db
		.select({ id: bookmarks.id })
		.from(bookmarks)
		.where(
			itemId
				? and(eq(bookmarks.userId, session.user.id), eq(bookmarks.itemId, itemId))
				: and(eq(bookmarks.userId, session.user.id), eq(bookmarks.groupId, groupId!))
		)
		.then((r) => r[0]);

	if (existing) {
		await db.delete(bookmarks).where(eq(bookmarks.id, existing.id));
		invalidateUserCache(session.user.id);
		return json({ bookmarked: false });
	}

	await db.insert(bookmarks).values({
		userId: session.user.id,
		itemId,
		groupId
	});

	invalidateUserCache(session.user.id);

	return json({ bookmarked: true }, { status: 201 });
});
