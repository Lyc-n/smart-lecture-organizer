import { requireSession } from '$lib/server/auth/session';
import { db } from '$lib/server/db';
import { groups } from '$lib/server/db/schema';
import { getUserGroupsPaginated, invalidateUserCache } from '$lib/server/db/helpers';
import { withErrorHandling } from '$lib/server/errors';
import { parsePagination } from '$lib/server/pagination';
import { parseBody } from '$lib/server/validators/group';
import { json, error } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = withErrorHandling(async (event) => {
	const session = await requireSession(event);
	const { page, limit } = parsePagination(new URL(event.request.url));

	const result = await getUserGroupsPaginated(session.user.id, page, limit);

	return json(result);
});

export const POST: RequestHandler = withErrorHandling(async (event) => {
	const session = await requireSession(event);

	const body = await event.request.json();
	const { name, color, icon, subtitle, description, parentId } = parseBody(body);

	if (parentId) {
		const parent = await db
			.select({ id: groups.id, userId: groups.userId })
			.from(groups)
			.where(eq(groups.id, parentId))
			.then((r) => r[0]);

		if (!parent) {
			error(404, 'Parent group not found');
		}
		if (parent.userId !== session.user.id) {
			error(403, 'Parent group does not belong to you');
		}
	}

	const [created] = await db
		.insert(groups)
		.values({
			userId: session.user.id,
			name,
			color,
			icon,
			subtitle,
			description,
			parentId
		})
		.returning();

	invalidateUserCache(session.user.id);

	return json(created, { status: 201 });
});
