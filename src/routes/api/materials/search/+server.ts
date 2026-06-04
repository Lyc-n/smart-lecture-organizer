import { materialService } from '$lib/server/services/material.service';
import { json } from '@sveltejs/kit';

export async function GET({ url }) {
    const keyword = url.searchParams.get('q');

    if (!keyword) {return json([]);}

    const result = await materialService.search(keyword);

    return json(result);
}