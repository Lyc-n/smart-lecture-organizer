import { MaterialRepository } from '$lib/server/repositories/material.repository.js';
import { requireAuth } from '$lib/server/require-auth';
import { error, redirect } from '@sveltejs/kit';

export async function GET({ params, locals }) {
	const user = requireAuth(locals);

	const material = await MaterialRepository.findById(params.id);

	if (!material) {
		throw error(404, 'Not found');
	}

	if (material.uploadedBy !== user.id) {
		throw error(403, 'Forbidden');
	}

	throw redirect(302, material.fileUrl);
}
