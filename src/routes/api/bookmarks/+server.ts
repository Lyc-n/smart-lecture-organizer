import { json } from '@sveltejs/kit';
import { requireAuth } from '$lib/server/require-auth';
import { BookmarkService } from '$lib/server/services/bookmark.service';

export async function GET({ locals }) {
	const user = requireAuth(locals);
	const bookmarks = await BookmarkService.getUserBookmarks(user.id);
	return json(bookmarks);
}
