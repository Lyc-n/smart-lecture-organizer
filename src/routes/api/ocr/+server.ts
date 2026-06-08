import { env } from '$env/dynamic/private';

export async function POST({ request }) {
	const form = await request.formData();
	const file = form.get('file') as File;

	console.log('file:', file?.name);

	const ocrForm = new FormData();
	ocrForm.append('file', file);
	// ocrForm.append('language', 'ind');

	const response = await fetch(
		'https://api.ocr.space/parse/image',
		{
			method: 'POST',
			headers: {
				apikey: env.OCR!
			},
			body: ocrForm
		}
	);

	const result = await response.json();

	console.log(result);

	return Response.json(result);
}