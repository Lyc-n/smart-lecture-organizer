import { requireSession } from '$lib/server/auth/session';
import { db } from '$lib/server/db';
import { items } from '$lib/server/db/schema';
import { json, error } from '@sveltejs/kit';
import { and, eq, sql } from 'drizzle-orm';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async (event) => {
	const session = await requireSession(event.request);

	const itemId = event.params.id;

	const item = await db
		.select({ id: items.id, userId: items.userId, isPinned: items.isPinned })
		.from(items)
		.where(and(eq(items.id, itemId), eq(items.userId, session.user.id)))
		.then((r) => r[0]);

	if (!item) {
		error(404, 'Item not found');
	}

	const [updated] = await db
		.update(items)
		.set({ isPinned: sql`NOT ${items.isPinned}` })
		.where(eq(items.id, itemId))
		.returning({ isPinned: items.isPinned });

	return json({ isPinned: updated.isPinned });
};
