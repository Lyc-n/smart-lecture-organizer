import { auth } from '$lib/server/auth';
import { db } from '$lib/server/db';
import { items, groups, ocrNotes, itemGroups } from '$lib/server/db/schema';
import { eq, and, or, sql, ilike } from 'drizzle-orm';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

const PAGE_SIZE = 20;

export const load: PageServerLoad = async (event) => {
	const session = await auth.api.getSession({
		headers: event.request.headers
	});

	if (!session) {
		redirect(302, '/auth/login');
	}

	const query = event.url.searchParams.get('q')?.trim() ?? '';

	if (!query) {
		return { query: '', results: { items: [], groups: [], notes: [] }, hasMoreItems: false, hasMoreGroups: false, hasMoreNotes: false };
	}

	const userId = session.user.id;
	const searchTerm = `%${query}%`;
	const tsQuery = sql`plainto_tsquery('indonesian', ${query})`;

	const fetchLimit = PAGE_SIZE + 1;

	const [rawItems, rawGroups, rawNotes] = await Promise.all([
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
			.limit(fetchLimit),
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
			.limit(fetchLimit),
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
			.limit(fetchLimit)
	]);

	return {
		query,
		results: {
			items: rawItems.slice(0, PAGE_SIZE),
			groups: rawGroups.slice(0, PAGE_SIZE),
			notes: rawNotes.slice(0, PAGE_SIZE)
		},
		hasMoreItems: rawItems.length > PAGE_SIZE,
		hasMoreGroups: rawGroups.length > PAGE_SIZE,
		hasMoreNotes: rawNotes.length > PAGE_SIZE
	};
};
