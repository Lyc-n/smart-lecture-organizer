import { requireSession } from '$lib/server/auth/session';
import { getOverdueCount } from '$lib/server/db/helpers';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async (event) => {
	const session = await requireSession(event.request).catch(() => null);

	let overdueCount = 0;
	if (session) {
		overdueCount = await getOverdueCount(session.user.id);
	}

	return {
		user: session?.user ?? null,
		session: session?.session ?? null,
		overdueCount
	};
};
