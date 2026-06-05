import { json } from '@sveltejs/kit';
import { CreateSubjectSchema } from '$lib/server/validators/subject.validator';
import { subjectService } from '$lib/server/services/subject.service';
import { requireAuth } from '$lib/server/require-auth';

// GET
export async function GET({ locals }) {
	const user = requireAuth(locals);
	const subjects = await subjectService.getAllByUserId(user.id);

	return json({ success: true, data: subjects });
}

// POST
export async function POST({ request, locals }) {
	const user = requireAuth(locals);
	const body = await request.json();
	const data = CreateSubjectSchema.parse(body);
	const subject = await subjectService.create(user.id, data);

	return json(
		{
			success: true,
			data: subject
		},
		{
			status: 201
		}
	);
}
