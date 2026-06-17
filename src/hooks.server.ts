import type { Handle, HandleServerError } from '@sveltejs/kit';
import { building } from '$app/environment';
import { auth } from '$lib/server/auth';
import { svelteKitHandler } from 'better-auth/svelte-kit';

const handleBetterAuth: Handle = async ({ event, resolve }) => {
	const session = await auth.api.getSession({ headers: event.request.headers });

	if (session) {
		event.locals.session = session.session;
		event.locals.user = session.user;
	}

	return svelteKitHandler({ event, resolve, auth, building });
};

export const handle: Handle = handleBetterAuth;

export const handleError: HandleServerError = async ({ error, event, status, message }) => {
	const err = error instanceof Error ? error : new Error(String(error));

	console.error(`[${status}] ${event.request.method} ${event.url.pathname}:`, {
		message: err.message,
		status,
		userId: event.locals.user?.id ?? null
	});

	return {
		message: status === 404 ? message : 'An unexpected error occurred'
	};
};
