import { json } from '@sveltejs/kit';
import { requireAuth } from '$lib/server/require-auth';
import { BookmarkService } from '$lib/server/services/bookmark.service';

export async function POST({ params, locals }) {
	const user = requireAuth(locals);
	const bookmark = await BookmarkService.create( user.id, params.id );

	return json(bookmark,{ status: 201 });
}

export async function DELETE({ params, locals }) {
	const user = requireAuth(locals);

	await BookmarkService.remove( user.id, params.id );

	return json({ success: true });
}