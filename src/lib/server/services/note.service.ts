import { NoteRepository } from '$lib/server/repositories/note.repository';

export const NoteService = {
	getById(id: string) {
		return NoteRepository.findById(id);
	},

	getByMaterialId(materialId: string) {
		return NoteRepository.findByMaterialId(
			materialId
		);
	},

	create(userId: string, materialId: string, content: string) {
		return NoteRepository.create({
			userId,
			materialId,
			content
		});
	},

	update(id: string, content: string) {
		return NoteRepository.update( id,content );
	},

	delete(id: string) {
		return NoteRepository.delete(id);
	}
};