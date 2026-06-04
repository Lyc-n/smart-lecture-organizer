import { put } from '@vercel/blob';
import { json } from '@sveltejs/kit';

import { requireAuth } from '$lib/server/require-auth';
import { validateFile } from '$lib/server/validators/upload.validator.js';

const MAX_SIZE = 50 * 1024 * 1024; // 50MB

export async function POST({ request, locals }) {
	requireAuth(locals);

	const formData = await request.formData();
	const file = formData.get('file');

	if (!(file instanceof File)) {
		return json({ error: 'File required' }, { status: 400 });
	}

    if (file.size > MAX_SIZE) {
        return json({ error: 'File too large' }, { status: 400 });
    }

    validateFile(file);

	const blob = await put(`materials/${crypto.randomUUID()}-${file.name}`, file, { access: 'private' });

	return json({
		pathname: blob.pathname,
        fileName: file.name,
        mimeType: file.type,
        fileSize: file.size
	});
}
