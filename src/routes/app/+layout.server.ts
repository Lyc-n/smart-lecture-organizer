import { db } from '$lib/server/db';
import { tasks } from '$lib/server/db/schema';
import { sql } from 'drizzle-orm';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async (event) => {
	const userId = event.locals.user?.id;

	let overdueCount = 0;
	if (userId) {
		const result = await db
			.select({ count: sql<number>`COUNT(*)` })
			.from(tasks)
			.where(
				sql`${tasks.userId} = ${userId} AND ${tasks.isCompleted} = false AND ${tasks.deadline} < NOW() AND ${tasks.deadline} IS NOT NULL`
			);
		overdueCount = Number(result[0]?.count ?? 0);
	}

	return {
		user: event.locals.user,
		session: event.locals.session,
		overdueCount
	};
};
