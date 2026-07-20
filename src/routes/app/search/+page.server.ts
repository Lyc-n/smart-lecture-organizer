import { requireSession } from '$lib/server/auth/session';
import { search } from '$lib/server/services/search';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const session = await requireSession(event.request).catch(() => null);

	if (!session) {
		redirect(302, '/auth/login');
	}

	const query = event.url.searchParams.get('q')?.trim() ?? '';

	const results = await search(session.user.id, query);
	return { query, ...results };
};
