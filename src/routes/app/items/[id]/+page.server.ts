import { auth } from '$lib/server/auth';
import { db } from '$lib/server/db';
import { items, itemGroups, groups, ocrNotes } from '$lib/server/db/schema';
import { eq, and } from 'drizzle-orm';
import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const session = await auth.api.getSession({
		headers: event.request.headers
	});

	if (!session) {
		redirect(302, '/auth/login');
	}

	const itemId = event.params.id;

	const item = await db
		.select()
		.from(items)
		.where(and(eq(items.id, itemId), eq(items.userId, session.user.id)))
		.then((r) => r[0]);

	if (!item) {
		error(404, 'Item not found');
	}

	const itemGroupsList = await db
		.select({
			id: groups.id,
			name: groups.name,
			color: groups.color,
			icon: groups.icon
		})
		.from(itemGroups)
		.innerJoin(groups, eq(itemGroups.groupId, groups.id))
		.where(eq(itemGroups.itemId, itemId));

	const note = await db
		.select()
		.from(ocrNotes)
		.where(eq(ocrNotes.itemId, itemId))
		.then((r) => r[0] ?? null);

	return { item, groups: itemGroupsList, note };
};
