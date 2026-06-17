import type { HandleClientError } from '@sveltejs/kit';

export const handleError: HandleClientError = async ({ error, status, message }) => {
	const err = error instanceof Error ? error : new Error(String(error));

	console.error(`[${status}] Client error:`, {
		message: err.message,
		status
	});

	return {
		message: status === 404 ? message : 'An unexpected error occurred'
	};
};
