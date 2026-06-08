import type { PageServerLoad } from './$types';
import { requireAuth } from '$lib/server/require-auth';
import { NoteService } from '$lib/server/services/note.service';

export const load: PageServerLoad = async ({ locals }) => {
	const user = requireAuth(locals);
	const notes = await NoteService.getByUserId(user.id);

	return {
		notes: notes.map((note) => ({
			id: note.id,
			title: note.title,
			subjectName: note.subject?.name ?? 'No subject',
			updatedAt: note.updatedAt.toISOString()
		}))
	};
};
