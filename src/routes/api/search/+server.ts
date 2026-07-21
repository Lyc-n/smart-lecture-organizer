import { requireSession } from '$lib/server/auth/session';
import { withErrorHandling } from '$lib/server/errors';
import { rateLimit, RATE_LIMITS } from '$lib/server/rate-limit';
import { search } from '$lib/server/services/search';
import { findSimilarImages } from '$lib/server/services/image-search';
import { groups } from '$lib/server/db/schema';
import { getOrThrow } from '$lib/server/db/helpers';
import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import type { Section } from '$lib/types/search';

export const POST: RequestHandler = withErrorHandling(async (event) => {
	const rl = rateLimit(event.request, RATE_LIMITS.search);
	if (!rl.allowed) {
		error(429, `Too many requests. Retry after ${Math.ceil(rl.retryAfterMs / 1000)}s`);
	}

	const session = await requireSession(event);

	const body = await event.request.json();
	const query = typeof body.query === 'string' ? body.query.trim() : '';
	const imageHash = typeof body.imageHash === 'string' ? body.imageHash.trim() : '';
	const typeFilter = typeof body.type === 'string' ? body.type : null;
	const groupId = typeof body.groupId === 'string' ? body.groupId : null;
	const threshold = typeof body.threshold === 'number' ? body.threshold : 10;
	const page = typeof body.page === 'number' && body.page > 0 ? Math.floor(body.page) : 0;
	const section = (typeof body.section === 'string' && ['items', 'groups', 'notes'].includes(body.section)) ? body.section as Section : null;

	const userId = session.user.id;

	if (imageHash) {
		const similar = await findSimilarImages(userId, imageHash, threshold);
		return json({ items: similar, groups: [], notes: [], hasMoreItems: false, hasMoreGroups: false, hasMoreNotes: false });
	}

	if (groupId) {
		await getOrThrow(groups, groupId, userId);
	}

	const results = await search(userId, query, { page, section, typeFilter, groupId });
	return json(results);
});
