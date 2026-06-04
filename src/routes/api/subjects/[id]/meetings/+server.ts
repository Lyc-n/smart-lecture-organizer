import { json, error } from '@sveltejs/kit';
import { requireAuth } from '$lib/server/require-auth';
import { meetingService } from '$lib/server/services/meeting.service';
import { subjectService } from '$lib/server/services/subject.service';
import { CreateMeetingSchema } from '$lib/server/validators/meeting.validator';

// GET
export async function GET({ params, locals }) {
	const user = requireAuth(locals);
	const subject = await subjectService.getById(params.id);

	if (!subject) {
		throw error(404, 'Subject not found');
	}

	if (subject.userId !== user.id) {
		throw error(403, 'Forbidden');
	}

	const meetings = await meetingService.getBySubjectId(params.id);

	return json({
		success: true,
		data: meetings
	});
}

// POST
export async function POST({ params, request, locals }) {
	const user = requireAuth(locals);
	const subject = await subjectService.getById(params.id);

	if (!subject) {
		throw error(404, 'Subject not found');
	}

	if (subject.userId !== user.id) {
		throw error(403, 'Forbidden');
	}

	const body = await request.json();
	const data = CreateMeetingSchema.parse(body);
	const meeting = await meetingService.create(params.id, data);

	return json(
		{ success: true, data: meeting },
		{ status: 201 }
	);
}
