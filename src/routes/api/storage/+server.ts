import { auth } from '$lib/server/auth';
import { checkStorageQuota } from '$lib/server/services/storage';
import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async (event) => {
	let session;
	try {
		session = await auth.api.getSession({
			headers: event.request.headers
		});
	} catch {
		return json({ error: 'Failed to validate session' }, { status: 503 });
	}

	if (!session) {
		error(401, 'Unauthorized');
	}

	try {
		const { used, limit } = await checkStorageQuota(session.user.id, 0);
		return json({ used, limit, allowed: used < limit });
	} catch {
		return json({ used: 0, limit: 52428800, allowed: true }, { status: 503 });
	}
};
