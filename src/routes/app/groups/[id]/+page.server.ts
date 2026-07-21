import { requireSession } from '$lib/server/auth/session';
import { db } from '$lib/server/db';
import { groups, items, itemGroups } from '$lib/server/db/schema';
import { getUserGroups, getGroupDescendants, getOrThrow } from '$lib/server/db/helpers';
import { eq, desc } from 'drizzle-orm';
import { getRecommendedGroups } from '$lib/server/services/recommend';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const session = await requireSession(event);

	const group = await getOrThrow(groups, event.params.id, session.user.id);

	const [tree, allGroups, groupItems, recommendations] = await Promise.all([
		getGroupDescendants(group.id),
		getUserGroups(session.user.id),
		db
			.select()
			.from(items)
			.innerJoin(itemGroups, eq(itemGroups.itemId, items.id))
			.where(eq(itemGroups.groupId, group.id))
			.orderBy(desc(items.createdAt))
			.limit(100),
		getRecommendedGroups(session.user.id)
	]);

	return {
		group,
		children: tree.rows,
		groups: allGroups,
		items: groupItems.map((r) => r.items),
		recommendations
	};
};
