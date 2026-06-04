import { json, error } from '@sveltejs/kit';
import { UpdateSubjectSchema } from '$lib/server/validators/subject.validator';
import { subjectService } from '$lib/server/services/subject.service';
import { requireAuth } from '$lib/server/require-auth';

// GET
export async function GET({ params, locals }) {
	requireAuth(locals);

	const subject = await subjectService.getById(params.id);

	if (!subject) {
		throw error(404, 'Subject not found');
	}

	return json({
		success: true,
		data: subject
	});
}

// PUT
export async function PUT({ params, request, locals }) {
	const user = requireAuth(locals);
	const subject = await subjectService.getById(params.id);

	if (!subject) {
		throw error(404, 'Subject not found');
	}

	if (subject.userId !== user.id) {
		throw error(403, 'Forbidden');
	}

	const body = await request.json();
	const data = UpdateSubjectSchema.parse(body);
	const updated = await subjectService.update(params.id, data);

	return json({
		success: true,
		data: updated
	});
}

// DELETE
export async function DELETE({ params, locals }) {
	const user = requireAuth(locals);
	const subject = await subjectService.getById(params.id);

	if (!subject) {
		throw error(404, 'Subject not found');
	}

	if (subject.userId !== user.id) {
		throw error(403, 'Forbidden');
	}

	await subjectService.delete(params.id);

	return json({
		success: true
	});
}
