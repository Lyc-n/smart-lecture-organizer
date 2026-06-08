import type { PageServerLoad } from './$types';
import { requireAuth } from '$lib/server/require-auth';
import { materialService } from '$lib/server/services/material.service';
import { NoteService } from '$lib/server/services/note.service';
import { getFileTypeLabel } from '$lib/utils/file-type-label';

export type SavedItem =
	| {
			kind: 'note';
			id: string;
			title: string;
			subjectName: string;
			createdAt: string;
	  }
	| {
			kind: 'material';
			id: string;
			title: string;
			subjectName: string;
			fileType: string;
			fileUrl: string;
			createdAt: string;
	  };

export const load: PageServerLoad = async ({ locals }) => {
	const user = requireAuth(locals);

	const [notes, materials] = await Promise.all([
		NoteService.getByUserId(user.id),
		materialService.getByUploadedBy(user.id)
	]);

	const savedItems: SavedItem[] = [
		...notes.map((note) => ({
			kind: 'note' as const,
			id: note.id,
			title: note.title,
			subjectName: note.subject?.name ?? 'No subject',
			createdAt: note.createdAt.toISOString()
		})),
		...materials.map((material) => ({
			kind: 'material' as const,
			id: material.id,
			title: material.title,
			subjectName: material.subject?.name ?? 'No subject',
			fileType: getFileTypeLabel(material.fileName, material.mimeType),
			fileUrl: material.fileUrl,
			createdAt: material.createdAt.toISOString()
		}))
	].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

	return { savedItems };
};
