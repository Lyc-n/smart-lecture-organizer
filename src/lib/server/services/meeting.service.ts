import type {
	CreateMeetingInput,
	UpdateMeetingInput
} from '$lib/server/validators/meeting.validator';

import { MeetingRepository } from '$lib/server/repositories/meeting.repository';

export const meetingService = {
	getById(id: string) {
		return MeetingRepository.findById(id);
	},

	getBySubjectId(subjectId: string) {
		return MeetingRepository.findBySubjectId(subjectId);
	},

	create(data: CreateMeetingInput) {
		return MeetingRepository.create(data);
	},

	update(id: string, data: UpdateMeetingInput) {
		return MeetingRepository.update(id, data);
	},

	delete(id: string) {
		return MeetingRepository.delete(id);
	}
};
