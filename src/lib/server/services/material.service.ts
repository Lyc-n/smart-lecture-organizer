import type {
	CreateMaterialInput,
	UpdateMaterialInput
} from '$lib/server/validators/material.validator';
import { MaterialRepository } from '../repositories/material.repository';

export const materialService = {
	getById(id: string) {
		return MaterialRepository.findById(id);
	},

	getByMeetingId(meetingId: string) {
		return MaterialRepository.findByMeetingId(meetingId);
	},

	getBySubjectId(subjectId: string) {
		return MaterialRepository.findBySubjectId(subjectId);
	},

	getByUploadedBy(userId: string) {
		return MaterialRepository.findByUploadedBy(userId);
	},

	create(userId: string, meetingId: string | null | undefined, data: CreateMaterialInput) {
		return MaterialRepository.create({
			uploadedBy: userId,
			...data,
			meetingId
		});
	},

	update(id: string, data: UpdateMaterialInput) {
		return MaterialRepository.update(id, data);
	},

	delete(id: string) {
		return MaterialRepository.delete(id);
	},

	search(userId: string, keyword: string) {
		return MaterialRepository.search(userId, keyword);
	}
};
