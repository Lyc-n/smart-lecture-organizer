import { requireAuth } from '$lib/server/require-auth';
import { materialService } from '$lib/server/services/material.service';
import { CreateMaterialSchema } from '$lib/server/validators/material.validator';
import { json } from '@sveltejs/kit';

export async function POST({ request, locals }) {
    const user = requireAuth(locals);
    const body = await request.json();
    const data = CreateMaterialSchema.parse(body);
    const material = await materialService.create(user.id, data.meetingId, data);

    return json(
        {
            success: true,
            data: material
        },
        {
            status: 201
        }
    );
}