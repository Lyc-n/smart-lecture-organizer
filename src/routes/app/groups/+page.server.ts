import { requireSession } from '$lib/server/auth/session';
import { getUserGroups } from '$lib/server/db/helpers';
import { getRecommendedGroups } from '$lib/server/services/recommend';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const session = await requireSession(event);

	const [userGroups, recommendations] = await Promise.all([
		getUserGroups(session.user.id),
		getRecommendedGroups(session.user.id)
	]);

	return { groups: userGroups, recommendations };
};
