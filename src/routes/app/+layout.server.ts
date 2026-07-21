import { requireSession } from '$lib/server/auth/session';
import { getOverdueCount } from '$lib/server/db/helpers';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async (event) => {
	const session = await requireSession(event);

	const overdueCount = await getOverdueCount(session.user.id);

	return {
		user: session.user,
		session: session.session,
		overdueCount
	};
};
