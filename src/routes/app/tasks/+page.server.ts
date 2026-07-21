import { requireSession } from '$lib/server/auth/session';
import { db } from '$lib/server/db';
import { tasks, groups, items } from '$lib/server/db/schema';
import { getUserGroups, getOverdueCount } from '$lib/server/db/helpers';
import { eq, and, asc, sql } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const session = await requireSession(event);

	const userId = session.user.id;
	const url = new URL(event.request.url);
	const status = url.searchParams.get('status') ?? 'all';
	const groupId = url.searchParams.get('groupId');
	const itemId = url.searchParams.get('itemId');

	const conditions = [eq(tasks.userId, userId)];

	if (status === 'pending') {
		conditions.push(eq(tasks.isCompleted, false));
	} else if (status === 'completed') {
		conditions.push(eq(tasks.isCompleted, true));
	} else if (status === 'overdue') {
		conditions.push(
			sql`${tasks.isCompleted} = false AND ${tasks.deadline} < NOW() AND ${tasks.deadline} IS NOT NULL`
		);
	}

	if (groupId) {
		conditions.push(eq(tasks.groupId, groupId));
	}
	if (itemId) {
		conditions.push(eq(tasks.itemId, itemId));
	}

	const [userTasks, userGroups, userItems, overdueCount] = await Promise.all([
		db
			.select()
			.from(tasks)
			.where(and(...conditions))
			.orderBy(asc(tasks.sortOrder), asc(tasks.createdAt))
			.limit(100),
		getUserGroups(userId),
		db
			.select({ id: items.id, name: items.name, type: items.type })
			.from(items)
			.where(eq(items.userId, userId))
			.orderBy(asc(items.name))
			.limit(200),
		getOverdueCount(userId)
	]);

	return { tasks: userTasks, groups: userGroups, items: userItems, overdueCount };
};
