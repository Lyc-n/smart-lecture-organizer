import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from '../auth/$types';

export const load: PageServerLoad = (event) => {
	if (!event.locals.user) {
		throw redirect(302, '/auth');
	}
	return { user: event.locals.user };
};
