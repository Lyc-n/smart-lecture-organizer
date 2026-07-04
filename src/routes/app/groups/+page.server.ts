import { db } from '$lib/server/db';
import { groups } from '$lib/server/db/schema';
import { error } from '@sveltejs/kit';
import { eq, asc } from 'drizzle-orm';
import { getRecommendedGroups } from '$lib/server/services/recommend';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const userId = event.locals.user?.id;
	if (!userId) error(401, 'Unauthorized');

	const [userGroups, recommendations] = await Promise.all([
		db
			.select()
			.from(groups)
			.where(eq(groups.userId, userId))
			.orderBy(asc(groups.sortOrder), asc(groups.name)),
		getRecommendedGroups(userId)
	]);

	return { groups: userGroups, recommendations };
};
