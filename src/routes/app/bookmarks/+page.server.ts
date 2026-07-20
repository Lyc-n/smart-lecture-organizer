import { requireSession } from '$lib/server/auth/session';
import { getUserBookmarks } from '$lib/server/db/helpers';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const session = await requireSession(event.request).catch(() => null);

	if (!session) {
		redirect(302, '/auth/login');
	}

	const userBookmarks = await getUserBookmarks(session.user.id);

	return { bookmarks: userBookmarks };
};
