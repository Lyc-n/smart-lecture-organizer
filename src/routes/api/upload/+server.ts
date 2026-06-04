import { put } from '@vercel/blob';
import { json } from '@sveltejs/kit';

import { requireAuth } from '$lib/server/require-auth';
import { validateFile } from '$lib/server/validators/upload.validator.js';
import { env } from '$env/dynamic/private';

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

	const blob = await put(`materials/${crypto.randomUUID()}-${file.name}`, file, { access: 'private', token: env.BLOB_READ_WRITE_TOKEN });
	
	return json({
		blopPath: blob.pathname,
        fileName: file.name,
        mimeType: file.type,
        fileSize: file.size
	});
}
