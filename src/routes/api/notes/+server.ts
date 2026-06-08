import { error, json } from '@sveltejs/kit';
import { requireAuth } from '$lib/server/require-auth';
import { NoteService } from '$lib/server/services/note.service';
import { subjectService } from '$lib/server/services/subject.service';
import { CreateNoteSchema } from '$lib/server/validators/note.validator';
import { ZodError } from 'zod';

export async function GET({ locals }) {
	const user = requireAuth(locals);
	const notes = await NoteService.getByUserId(user.id);

	return json({ success: true, data: notes });
}

export async function POST({ request, locals }) {
	const user = requireAuth(locals);

	try {
		const body = await request.json();
		const data = CreateNoteSchema.parse(body);

		const subject = await subjectService.getById(data.subjectId);
		if (!subject || subject.userId !== user.id) {
			throw error(403, 'Forbidden');
		}

		const [note] = await NoteService.createStandalone(user.id, data);
		if (!note) {
			throw error(500, 'Failed to create note');
		}

		return json({ success: true, data: note }, { status: 201 });
	} catch (err) {
		if (err instanceof ZodError) {
			throw error(400, err.issues[0]?.message ?? 'Invalid note data');
		}
		throw err;
	}
}
