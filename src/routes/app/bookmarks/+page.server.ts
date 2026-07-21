import { requireSession } from '$lib/server/auth/session';
import { getUserBookmarks } from '$lib/server/db/helpers';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const session = await requireSession(event);

	const userBookmarks = await getUserBookmarks(session.user.id);

	return { bookmarks: userBookmarks };
};
