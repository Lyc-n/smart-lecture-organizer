import { requireSession } from '$lib/server/auth/session';
import { db } from '$lib/server/db';
import { items } from '$lib/server/db/schema';
import { getOrThrow } from '$lib/server/db/helpers';
import { withErrorHandling } from '$lib/server/errors';
import { validateUUID } from '$lib/server/validators/common';
import { json } from '@sveltejs/kit';
import { eq, sql } from 'drizzle-orm';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = withErrorHandling(async (event) => {
	const session = await requireSession(event);
	const id = validateUUID(event.params.id);

	const item = await getOrThrow(items, id, session.user.id);

	const [updated] = await db
		.update(items)
		.set({ isPinned: sql`NOT ${items.isPinned}` })
		.where(eq(items.id, item.id))
		.returning({ isPinned: items.isPinned });

	return json({ isPinned: updated.isPinned });
});
