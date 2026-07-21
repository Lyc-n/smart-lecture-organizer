import { requireSession } from '$lib/server/auth/session';
import { search } from '$lib/server/services/search';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const session = await requireSession(event);

	const query = event.url.searchParams.get('q')?.trim() ?? '';

	const results = await search(session.user.id, query);
	return { query, ...results };
};
