import { requireAuth } from '$lib/server/require-auth';
import { NoteService } from '$lib/server/services/note.service';
import { CreateNoteSchema } from '$lib/server/validators/note.validator';
import { json } from '@sveltejs/kit';

export async function GET({ params, locals }) {
	requireAuth(locals);

	const notes = await NoteService.getByMaterialId(params.id);

	return json(notes);
}

export async function POST({ params, request, locals }) {
	const user = requireAuth(locals);
	const body = await request.json();
	const data = CreateNoteSchema.parse(body);
	const note = await NoteService.create(user.id, params.id, data.content);

	return json(note, { status: 201 });
}
