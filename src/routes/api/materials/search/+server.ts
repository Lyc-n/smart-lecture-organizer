import { requireAuth } from '$lib/server/require-auth.js';
import { materialService } from '$lib/server/services/material.service';
import { json } from '@sveltejs/kit';

export async function GET({ url, locals }) {
    const user = requireAuth(locals);
    const keyword = url.searchParams.get('q');
    
    if (!keyword) {return json({
        success: true,
        data: []
    });}
    
    const materials = await materialService.search(user.id, keyword);
    
    return json({
        success: true,
        data: materials
    });
}