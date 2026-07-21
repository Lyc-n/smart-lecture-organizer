import { requireSession } from '$lib/server/auth/session';
import { db } from '$lib/server/db';
import { items, groups, tasks, recentAccess } from '$lib/server/db/schema';
import { getUserGroupCount } from '$lib/server/db/helpers';
import { eq, desc, sql } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const session = await requireSession(event);

	const userId = session.user.id;
	const now = new Date().toISOString();

	const [pinnedItems, groupCount, recent, taskStats] = await Promise.all([
		db
			.select()
			.from(items)
			.where(sql`${items.userId} = ${userId} AND ${items.isPinned} = true`)
			.orderBy(desc(items.createdAt))
			.limit(20),
		getUserGroupCount(userId),
		db
			.select({
				id: recentAccess.id,
				accessedAt: recentAccess.accessedAt,
				itemId: recentAccess.itemId,
				groupId: recentAccess.groupId,
				itemName: items.name,
				itemType: items.type,
				groupName: groups.name,
				groupColor: groups.color,
				groupIcon: groups.icon
			})
			.from(recentAccess)
			.leftJoin(items, eq(recentAccess.itemId, items.id))
			.leftJoin(groups, eq(recentAccess.groupId, groups.id))
			.where(eq(recentAccess.userId, userId))
			.orderBy(desc(recentAccess.accessedAt))
			.limit(10),
		db
			.select({
				pending: sql<number>`COUNT(*) FILTER (WHERE ${tasks.isCompleted} = false)`,
				overdue: sql<number>`COUNT(*) FILTER (WHERE ${tasks.isCompleted} = false AND ${tasks.deadline} IS NOT NULL AND ${tasks.deadline} < ${now})`
			})
			.from(tasks)
			.where(eq(tasks.userId, userId))
			.then((r) => r[0] ?? { pending: 0, overdue: 0 })
	]);

	return { pinnedItems, groupCount, recentAccess: recent, tasksPending: Number(taskStats.pending), tasksOverdue: Number(taskStats.overdue) };
};
