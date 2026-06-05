import type {
	CreateSubjectInput,
	UpdateSubjectInput
} from '$lib/server/validators/subject.validator';
import { SubjectRepository } from '$lib/server/repositories/subject.repository';

export const subjectService = {
	// GET ALL by ID
	getAllByUserId(userId: string) {
		return SubjectRepository.findByUserId(userId);
	},

	// GET Some by ID
	getById(id: string) {
		return SubjectRepository.findById(id);
	},

	// CREATE
	create(userId: string, data: CreateSubjectInput) {
		return SubjectRepository.create({
			userId,
			...data
		});
	},

	// UPDATE
	update(id: string, data: UpdateSubjectInput) {
		return SubjectRepository.update(id, data);
	},

	// DELETE
	delete(id: string) {
		return SubjectRepository.delete(id);
	}
};
