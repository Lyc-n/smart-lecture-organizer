import { requireAuth } from '$lib/server/require-auth';
import { materialService } from '$lib/server/services/material.service';
import {
	CreateMaterialSchema,
	UpdateMaterialSchema
} from '$lib/server/validators/material.validator';
import { error, json } from '@sveltejs/kit';

export async function GET({ params, locals }) {
	const user = requireAuth(locals);

	const material = await materialService.getById(params.id);

	if (!material) {
		throw error(404, 'Material not found');
	}

	if (material.uploadedBy !== user.id) {
		throw error(403, 'Forbidden');
	}

	return json({ success: true, data: material });
}

export async function POST({ params, request, locals }) {
	const user = requireAuth(locals);

	const body = await request.json();

	const data = CreateMaterialSchema.parse(body);

	const material = await materialService.create(user.id, params.id, data);

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

export async function PUT({ params, request, locals }) {
	requireAuth(locals);

	const body = await request.json();

	const data = UpdateMaterialSchema.parse(body);

	const updated = await materialService.update(params.id, data);

	return json({ success: true, data: updated });
}

export async function DELETE({ params, locals }) {
	const user = requireAuth(locals);

	const material = await materialService.getById(params.id);

	if (!material) {
		throw error(404, 'Material not found');
	}

	if (material.uploadedBy !== user.id) {
		throw error(403, 'Forbidden');
	}

	await materialService.delete(params.id);

	return json({
		success: true
	});
}
