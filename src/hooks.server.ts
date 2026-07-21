import { isAuthPath } from 'better-auth/svelte-kit';
import { auth } from '$lib/server/auth';
import { redirect } from '@sveltejs/kit';

export const handle = async ({ event, resolve }) => {
	if (isAuthPath(event.url.toString(), auth.options)) {
		return auth.handler(event.request);
	}

	if (event.url.pathname.startsWith('/app') || event.url.pathname.startsWith('/api')) {
		const sessionData = await auth.api.getSession({
			headers: event.request.headers
		});

		if (event.url.pathname.startsWith('/app') && !sessionData) {
			redirect(302, '/auth/login');
		}

		if (sessionData) {
			event.locals.user = sessionData.user;
			event.locals.session = sessionData.session;
		}
	}

	return resolve(event);
};
