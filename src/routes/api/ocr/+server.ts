import { requireSession } from '$lib/server/auth/session';
import { processOcr } from '$lib/server/services/ocr';
import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const config = {
	maxDuration: 30
};

export const POST: RequestHandler = async (event) => {
	const session = await requireSession(event.request);

	const body = await event.request.json();
	const itemId = typeof body.itemId === 'string' ? body.itemId.trim() : '';

	if (!itemId) {
		error(400, 'itemId diperlukan');
	}

	try {
		const result = await processOcr(itemId, session.user.id);
		return json(result);
	} catch (e) {
		const message = e instanceof Error ? e.message : 'OCR gagal';
		error(500, message);
	}
};
