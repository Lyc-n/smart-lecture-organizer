import { NoteRepository } from '$lib/server/repositories/note.repository';
import type {
	CreateMaterialNoteInput,
	CreateNoteInput,
	UpdateNoteInput
} from '$lib/server/validators/note.validator';

export const NoteService = {
	getById(id: string) {
		return NoteRepository.findById(id);
	},

	getByMaterialId(materialId: string) {
		return NoteRepository.findByMaterialId(materialId);
	},

	getByUserId(userId: string) {
		return NoteRepository.findByUserId(userId);
	},

	createStandalone(userId: string, data: CreateNoteInput) {
		return NoteRepository.create({
			userId,
			title: data.title,
			content: data.content,
			subjectId: data.subjectId
		});
	},

	createDraft(userId: string, subjectId: string) {
		return NoteRepository.create({
			userId,
			subjectId,
			title: 'Untitled',
			content: ''
		});
	},

	createForMaterial(userId: string, materialId: string, subjectId: string | null, data: CreateMaterialNoteInput) {
		return NoteRepository.create({
			userId,
			materialId,
			subjectId,
			title: data.title ?? 'Untitled',
			content: data.content
		});
	},

	update(id: string, data: UpdateNoteInput) {
		return NoteRepository.update(id, data);
	},

	delete(id: string) {
		return NoteRepository.delete(id);
	}
};
