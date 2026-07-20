import { requireSession } from '$lib/server/auth/session';
import { db } from '$lib/server/db';
import { items, itemGroups, groups, ocrNotes } from '$lib/server/db/schema';
import { getOrThrow } from '$lib/server/db/helpers';
import { eq } from 'drizzle-orm';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const session = await requireSession(event.request).catch(() => null);

	if (!session) {
		redirect(302, '/auth/login');
	}

	const item = await getOrThrow(items, event.params.id, session.user.id);

	const itemGroupsList = await db
		.select({
			id: groups.id,
			name: groups.name,
			color: groups.color,
			icon: groups.icon
		})
		.from(itemGroups)
		.innerJoin(groups, eq(itemGroups.groupId, groups.id))
		.where(eq(itemGroups.itemId, item.id));

	const note = await db
		.select()
		.from(ocrNotes)
		.where(eq(ocrNotes.itemId, item.id))
		.then((r) => r[0] ?? null);

	return { item, groups: itemGroupsList, note };
};
