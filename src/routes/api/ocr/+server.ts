import { requireSession } from '$lib/server/auth/session';
import { withErrorHandling } from '$lib/server/errors';
import { rateLimit, RATE_LIMITS } from '$lib/server/rate-limit';
import { processOcr } from '$lib/server/services/ocr';
import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const config = {
	maxDuration: 30
};

export const POST: RequestHandler = withErrorHandling(async (event) => {
	const rl = rateLimit(event.request, RATE_LIMITS.ocr);
	if (!rl.allowed) {
		error(429, `Too many requests. Retry after ${Math.ceil(rl.retryAfterMs / 1000)}s`);
	}

	const session = await requireSession(event);

	const body = await event.request.json();
	const itemId = typeof body.itemId === 'string' ? body.itemId.trim() : '';

	if (!itemId) {
		error(400, 'itemId is required');
	}

	const result = await processOcr(itemId, session.user.id);
	return json(result);
});
