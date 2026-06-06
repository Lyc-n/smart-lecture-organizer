import { json } from '@sveltejs/kit';
import { requireAuth } from '$lib/server/require-auth';
import { OcrService } from '$lib/server/services/ocr.service';

export async function POST({ params, request, locals }) {
	requireAuth(locals);

	const body = await request.json();
	const result = await OcrService.create(params.id, body.text);

	return json(result);
}
