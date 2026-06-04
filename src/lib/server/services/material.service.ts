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

	create(userId: string, meetingId: string, data: CreateMaterialInput) {
		return MaterialRepository.create({
			meetingId,
			uploadedBy: userId,
			...data
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
