import { auth } from '$lib/server/auth';
import { db } from '$lib/server/db';
import { items, groups, ocrNotes, itemGroups } from '$lib/server/db/schema';
import { eq, and, or, sql, ilike } from 'drizzle-orm';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const session = await auth.api.getSession({
		headers: event.request.headers
	});

	if (!session) {
		redirect(302, '/auth/login');
	}

	const query = event.url.searchParams.get('q')?.trim() ?? '';

	if (!query) {
		return { query: '', results: { items: [], groups: [], notes: [] } };
	}

	const userId = session.user.id;
	const searchTerm = `%${query}%`;
	const tsQuery = sql`plainto_tsquery('indonesian', ${query})`;

	const [matchedItems, matchedGroups, matchedNotes] = await Promise.all([
		db
			.select()
			.from(items)
			.where(
				and(
					eq(items.userId, userId),
					or(
						ilike(items.name, searchTerm),
						sql`to_tsvector('indonesian', ${items.name}) @@ ${tsQuery}`
					)
				)
			)
			.orderBy(sql`to_tsvector('indonesian', ${items.name}) @@ ${tsQuery} DESC, ${items.createdAt} DESC`)
			.limit(20),
		db
			.select()
			.from(groups)
			.where(
				and(
					eq(groups.userId, userId),
					or(
						ilike(groups.name, searchTerm),
						ilike(groups.subtitle, searchTerm),
						sql`to_tsvector('indonesian', coalesce(${groups.name}, '') || ' ' || coalesce(${groups.subtitle}, '') || ' ' || coalesce(${groups.description}, '')) @@ ${tsQuery}`
					)
				)
			)
			.orderBy(sql`to_tsvector('indonesian', coalesce(${groups.name}, '')) @@ ${tsQuery} DESC, ${groups.name} ASC`)
			.limit(20),
		db
			.select({
				note: ocrNotes,
				itemName: items.name,
				itemId: items.id
			})
			.from(ocrNotes)
			.innerJoin(items, eq(ocrNotes.itemId, items.id))
			.where(
				and(
					eq(items.userId, userId),
					sql`to_tsvector('indonesian', coalesce(${ocrNotes.content}, '')) @@ plainto_tsquery('indonesian', ${query})`
				)
			)
			.orderBy(sql`ts_rank(to_tsvector('indonesian', coalesce(${ocrNotes.content}, '')), plainto_tsquery('indonesian', ${query})) DESC`)
			.limit(20)
	]);

	return {
		query,
		results: { items: matchedItems, groups: matchedGroups, notes: matchedNotes }
	};
};
