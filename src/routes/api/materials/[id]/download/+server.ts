import { MaterialRepository } from '$lib/server/repositories/material.repository.js';
import { requireAuth } from '$lib/server/require-auth';
import { error } from '@sveltejs/kit';

export async function GET({ params, locals }) {
    requireAuth(locals);

    const material = await MaterialRepository.findById( params.id );

    if (!material) {
        throw error(404,'Not found');
    }

    const blob = await head( material.fileUrl );

    return Response.redirect( blob.url, 302 );
}