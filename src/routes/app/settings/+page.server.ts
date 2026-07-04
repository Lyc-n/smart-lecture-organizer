import { checkStorageQuota } from '$lib/server/services/storage';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const userId = event.locals.user?.id;
	if (!userId) error(401, 'Unauthorized');

	const { used, limit } = await checkStorageQuota(userId, 0);

	return { used, limit };
};
