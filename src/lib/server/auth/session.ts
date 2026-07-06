import { auth } from '$lib/server/auth';
import { error } from '@sveltejs/kit';

export async function requireSession(request: Request) {
	const session = await auth.api.getSession({
		headers: request.headers
	});

	if (!session) {
		error(401, 'Unauthorized');
	}

	return session;
}
