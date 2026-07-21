import { auth } from '$lib/server/auth';
import { error } from '@sveltejs/kit';
import { TTLCache } from '$lib/server/cache';

const SESSION_CACHE = new TTLCache(30_000);

export async function requireSession(event: { locals: App.Locals; request: Request }) {
	if (event.locals.session) {
		return { user: event.locals.user!, session: event.locals.session };
	}

	const token = event.request.headers.get('better-auth.session_token') || event.request.headers.get('authorization')?.replace('Bearer ', '') || '';

	if (token) {
		const cached = SESSION_CACHE.get<{ user: any; session: any } | null>(token);
		if (cached === null) {
			error(401, 'Unauthorized');
		}
		if (cached) {
			return cached;
		}
	}

	const session = await auth.api.getSession({
		headers: event.request.headers
	});

	if (!session) {
		if (token) {
			SESSION_CACHE.set(token, null);
		}
		error(401, 'Unauthorized');
	}

	if (token) {
		SESSION_CACHE.set(token, session);
	}

	return session;
}
