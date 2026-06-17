import { requireAuth } from '$lib/server/require-auth';
import { NoteService } from '$lib/server/services/note.service';
import { subjectService } from '$lib/server/services/subject.service';
import { UpdateNoteSchema } from '$lib/server/validators/note.validator';
import { error, json } from '@sveltejs/kit';
import { ZodError } from 'zod';

export async function GET({ params, locals }) {
	const user = requireAuth(locals);

	const note = await NoteService.getById(params.id);

	if (!note) {
		throw error(404, 'Note not found');
	}

	if (note.userId !== user.id) {
		throw error(403, 'Forbidden');
	}

	return json({ success: true, data: note });
}

export async function PUT({ params, request, locals }) {
	const user = requireAuth(locals);

	const note = await NoteService.getById(params.id);
	if (!note) {
		throw error(404, 'Note not found');
	}

	if (note.userId !== user.id) {
		throw error(403, 'Forbidden');
	}

	try {
		const body = await request.json();
		const data = UpdateNoteSchema.parse(body);

		if (data.subjectId) {
			const subject = await subjectService.getById(data.subjectId);
			if (!subject || subject.userId !== user.id) {
				throw error(403, 'Forbidden');
			}
		}

		const updated = await NoteService.update(params.id, data);
		if (!updated) {
			throw error(500, 'Failed to update note');
		}

		return json({ success: true, data: updated });
	} catch (err) {
		if (err instanceof ZodError) {
			throw error(400, err.issues[0]?.message ?? 'Invalid note data');
		}
		throw err;
	}
}

export async function DELETE({ params, locals }) {
	const user = requireAuth(locals);

	const note = await NoteService.getById(params.id);
	if (!note) {
		throw error(404, 'Note not found');
	}

	if (note.userId !== user.id) {
		throw error(403, 'Forbidden');
	}

	await NoteService.delete(params.id);

	return json({ success: true });
}
