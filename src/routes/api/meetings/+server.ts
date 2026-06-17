import { requireAuth } from '$lib/server/require-auth';
import { meetingService } from '$lib/server/services/meeting.service.js';
import { CreateMeetingSchema } from '$lib/server/validators/meeting.validator';
import { json } from '@sveltejs/kit';

export async function POST({ request, locals }) {
	requireAuth(locals);
	const body = await request.json();
	const data = CreateMeetingSchema.parse(body);
	const meeting = await meetingService.create(data);

	return json({ success: true, data: meeting }, { status: 201 });
}
