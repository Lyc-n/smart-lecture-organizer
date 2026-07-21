import { requireSession } from '$lib/server/auth/session';
import { getUserGroups } from '$lib/server/db/helpers';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const session = await requireSession(event);

	const userGroups = await getUserGroups(session.user.id);

	return { groups: userGroups };
};
