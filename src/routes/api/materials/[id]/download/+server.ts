import { MaterialRepository } from '$lib/server/repositories/material.repository.js';
import { requireAuth } from '$lib/server/require-auth';
import { error } from '@sveltejs/kit';
import { head } from '@vercel/blob';

export async function GET({ params, locals }) {
    requireAuth(locals);

    const material = await MaterialRepository.findById( params.id );

    if (!material) {
        throw error(404,'Not found');
    }

    const blob = await head( material.blobPath );

    return Response.redirect( blob.url, 302 );
}