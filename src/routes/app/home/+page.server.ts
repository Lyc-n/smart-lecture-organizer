import { error, fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { requireAuth } from '$lib/server/require-auth';
import { NoteService } from '$lib/server/services/note.service';
import { subjectService } from '$lib/server/services/subject.service';

export const actions: Actions = {
	createNote: async ({ locals }) => {
		const user = requireAuth(locals);
		const subjects = await subjectService.getAllByUserId(user.id);

		if (subjects.length === 0) {
			return fail(400, { message: 'Create a subject before adding notes.' });
		}

		const [note] = await NoteService.createDraft(user.id, subjects[0].id);
		if (!note) {
			return fail(500, { message: 'Failed to create note.' });
		}

		throw redirect(303, `/app/notes/${note.id}`);
	}
};
