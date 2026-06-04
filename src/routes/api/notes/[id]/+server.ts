import { requireAuth } from '$lib/server/require-auth';
import { NoteService } from '$lib/server/services/note.service';
import { UpdateNoteSchema } from '$lib/server/validators/note.validator';
import { error, json } from '@sveltejs/kit';

export async function GET({params, locals}) {
	requireAuth(locals);

	const note = await NoteService.getById(params.id);

	if (!note) {
		throw error(404, 'Note not found');
	}

	return json(note);
}

export async function PUT({params, request, locals}) {
	requireAuth(locals);

	const body = await request.json();
	const data = UpdateNoteSchema.parse(body);
	const note = await NoteService.update(
			params.id,
			data.content ?? ''
		);

	return json(note);
}

export async function DELETE({params, locals}) {
	requireAuth(locals);

	await NoteService.delete(params.id);

	return json({success: true});
}