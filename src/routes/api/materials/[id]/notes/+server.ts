import { requireAuth } from '$lib/server/require-auth';
import { materialService } from '$lib/server/services/material.service';
import { NoteService } from '$lib/server/services/note.service';
import { CreateMaterialNoteSchema } from '$lib/server/validators/note.validator';
import { error, json } from '@sveltejs/kit';

export async function GET({ params, locals }) {
	requireAuth(locals);

	const notes = await NoteService.getByMaterialId(params.id);

	return json(notes);
}

export async function POST({ params, request, locals }) {
	const user = requireAuth(locals);
	const body = await request.json();
	const data = CreateMaterialNoteSchema.parse(body);

	const material = await materialService.getById(params.id);
	if (!material) {
		throw error(404, 'Material not found');
	}

	const note = await NoteService.createForMaterial(
		user.id,
		params.id,
		material.subjectId,
		data
	);

	return json(note, { status: 201 });
}
