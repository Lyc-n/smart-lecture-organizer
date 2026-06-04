import { requireAuth } from '$lib/server/require-auth';
import { meetingService } from '$lib/server/services/meeting.service';
import { subjectService } from '$lib/server/services/subject.service';
import { UpdateMeetingSchema } from '$lib/server/validators/meeting.validator';
import { error, json } from '@sveltejs/kit';

export async function GET({ params, locals }) {
	requireAuth(locals);
	const meeting = await meetingService.getById(params.id);

	if (!meeting) {
		throw error(404, 'Meeting not found');
	}

	return json({success: true, data: meeting});
}

export async function PUT({
	params,
	request,
	locals
}) {
	const user =
		requireAuth(locals);

	const meeting =
		await meetingService.getById(
			params.id
		);

	if (!meeting) {
		throw error(
			404,
			'Meeting not found'
		);
	}

	const subject =
		await subjectService.getById(
			meeting.subjectId
		);

	if (
		subject?.userId !== user.id
	) {
		throw error(
			403,
			'Forbidden'
		);
	}

	const body =
		await request.json();

	const data =
		UpdateMeetingSchema.parse(
			body
		);

	const updated =
		await meetingService.update(
			params.id,
			data
		);

	return json({
		success: true,
		data: updated
	});
}

export async function DELETE({
	params,
	locals
}) {
	const user =
		requireAuth(locals);

	const meeting =
		await meetingService.getById(
			params.id
		);

	if (!meeting) {
		throw error(
			404,
			'Meeting not found'
		);
	}

	const subject =
		await subjectService.getById(
			meeting.subjectId
		);

	if (
		subject?.userId !== user.id
	) {
		throw error(
			403,
			'Forbidden'
		);
	}

	await meetingService.delete(
		params.id
	);

	return json({
		success: true
	});
}