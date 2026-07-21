import { error } from '@sveltejs/kit';
import type { RequestEvent, RequestHandler } from '@sveltejs/kit';

type Handler = (event: RequestEvent) => Promise<Response>;

export function withErrorHandling(handler: Handler): RequestHandler {
	return async (event) => {
		try {
			return await handler(event);
		} catch (e) {
			if (e instanceof Response) throw e;

			const message = e instanceof Error ? e.message : 'Internal server error';
			console.error(`[API] ${event.route.id}:`, message);
			error(500, message);
		}
	};
}
