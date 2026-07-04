import { db } from '$lib/server/db';
import { groups, items, itemGroups } from '$lib/server/db/schema';
import { error } from '@sveltejs/kit';
import { eq, asc, sql, desc } from 'drizzle-orm';
import { getRecommendedGroups } from '$lib/server/services/recommend';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const userId = event.locals.user?.id;
	if (!userId) error(401, 'Unauthorized');

	const group = await db
		.select()
		.from(groups)
		.where(eq(groups.id, event.params.id))
		.then((r) => r[0]);

	if (!group) {
		error(404, 'Group not found');
	}
	if (group.userId !== userId) {
		error(403, 'Forbidden');
	}

	const [tree, allGroups, groupItems, recommendations] = await Promise.all([
		db.execute<typeof groups.$inferSelect>(sql`
			WITH RECURSIVE descendants AS (
				SELECT * FROM ${groups} WHERE parent_id = ${group.id}
				UNION ALL
				SELECT g.* FROM ${groups} g
				JOIN descendants d ON g.parent_id = d.id
			)
			SELECT * FROM descendants
			ORDER BY sort_order, name
		`),
		db
			.select()
			.from(groups)
			.where(eq(groups.userId, userId))
			.orderBy(asc(groups.sortOrder), asc(groups.name)),
		db
			.select()
			.from(items)
			.innerJoin(itemGroups, eq(itemGroups.itemId, items.id))
			.where(eq(itemGroups.groupId, group.id))
			.orderBy(desc(items.createdAt)),
		getRecommendedGroups(userId)
	]);

	return {
		group,
		children: tree.rows,
		groups: allGroups,
		items: groupItems.map((r) => r.items),
		recommendations
	};
};
