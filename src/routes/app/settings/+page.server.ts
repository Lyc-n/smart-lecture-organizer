import { requireSession } from '$lib/server/auth/session';
import { checkStorageQuota } from '$lib/server/services/storage';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const session = await requireSession(event);

	const { used, limit } = await checkStorageQuota(session.user.id, 0);

	return { used, limit };
};
