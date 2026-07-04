import { auth } from '$lib/server/auth';
import { db } from '$lib/server/db';
import { bookmarks, items, groups } from '$lib/server/db/schema';
import { json, error } from '@sveltejs/kit';
import { eq, and, desc, sql } from 'drizzle-orm';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async (event) => {
	const session = await auth.api.getSession({
		headers: event.request.headers
	});

	if (!session) {
		error(401, 'Unauthorized');
	}

	const userId = session.user.id;

	const userBookmarks = await db
		.select({
			id: bookmarks.id,
			createdAt: bookmarks.createdAt,
			itemId: bookmarks.itemId,
			groupId: bookmarks.groupId,
			itemName: items.name,
			itemType: items.type,
			itemFileUrl: items.fileUrl,
			groupName: groups.name,
			groupColor: groups.color,
			groupIcon: groups.icon
		})
		.from(bookmarks)
		.leftJoin(items, eq(bookmarks.itemId, items.id))
		.leftJoin(groups, eq(bookmarks.groupId, groups.id))
		.where(eq(bookmarks.userId, userId))
		.orderBy(desc(bookmarks.createdAt));

	return json(userBookmarks);
};

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

	if (itemId) {
		const item = await db
			.select({ id: items.id, userId: items.userId })
			.from(items)
			.where(eq(items.id, itemId))
			.then((r) => r[0]);

		if (!item) error(404, 'Item not found');
		if (item.userId !== session.user.id) error(403, 'Item does not belong to you');
	}

	if (groupId) {
		const group = await db
			.select({ id: groups.id, userId: groups.userId })
			.from(groups)
			.where(eq(groups.id, groupId))
			.then((r) => r[0]);

		if (!group) error(404, 'Group not found');
		if (group.userId !== session.user.id) error(403, 'Group does not belong to you');
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
		return json({ bookmarked: false });
	}

	await db.insert(bookmarks).values({
		userId: session.user.id,
		itemId,
		groupId
	});

	return json({ bookmarked: true }, { status: 201 });
};
