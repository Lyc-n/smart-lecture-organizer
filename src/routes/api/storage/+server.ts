import { requireSession } from '$lib/server/auth/session';
import { checkStorageQuota } from '$lib/server/services/storage';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async (event) => {
	const session = await requireSession(event.request);

	try {
		const { used, limit } = await checkStorageQuota(session.user.id, 0);
		return json({ used, limit, allowed: used < limit });
	} catch {
		return json({ used: 0, limit: 52428800, allowed: true }, { status: 503 });
	}
};
