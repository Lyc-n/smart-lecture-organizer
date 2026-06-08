import { requireAuth } from '$lib/server/require-auth';
import { NoteService } from '$lib/server/services/note.service.js';
import { CreateNoteSchema } from '$lib/server/validators/note.validator.js';
import { json } from '@sveltejs/kit';

export async function POST({ request, locals }) {
    const user = requireAuth(locals);

    const body = await request.json();
    const data = CreateNoteSchema.parse(body);
    const meeting = await NoteService.create(user.id, data.materialId ?? null, data.title, data.content);

    return json({ success: true, data: meeting }, { status: 201 });
}