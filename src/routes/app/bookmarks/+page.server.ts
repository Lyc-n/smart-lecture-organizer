import { auth } from '$lib/server/auth';
import { db } from '$lib/server/db';
import { bookmarks, items, groups } from '$lib/server/db/schema';
import { eq, desc } from 'drizzle-orm';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const session = await auth.api.getSession({
		headers: event.request.headers
	});

	if (!session) {
		redirect(302, '/auth/login');
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

	return { bookmarks: userBookmarks };
};
