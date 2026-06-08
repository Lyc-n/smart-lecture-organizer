import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { requireAuth } from '$lib/server/require-auth';
import { NoteService } from '$lib/server/services/note.service';
import { subjectService } from '$lib/server/services/subject.service';

export const load: PageServerLoad = async ({ params, locals }) => {
	const user = requireAuth(locals);
	const note = await NoteService.getById(params.id);

	if (!note) {
		throw error(404, 'Note not found');
	}

	if (note.userId !== user.id) {
		throw error(403, 'Forbidden');
	}

	const subjects = await subjectService.getAllByUserId(user.id);

	return {
		note: {
			id: note.id,
			title: note.title,
			content: note.content,
			subjectId: note.subjectId,
			updatedAt: note.updatedAt
		},
		subjects: subjects.map((subject) => ({
			id: subject.id,
			name: subject.name
		}))
	};
};
