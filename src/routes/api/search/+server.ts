import { auth } from '$lib/server/auth';
import { db } from '$lib/server/db';
import { items, groups, ocrNotes, itemGroups } from '$lib/server/db/schema';
import { findSimilarImages } from '$lib/server/services/image-search';
import { json, error } from '@sveltejs/kit';
import { eq, and, or, sql, ilike } from 'drizzle-orm';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async (event) => {
	const session = await auth.api.getSession({
		headers: event.request.headers
	});

	if (!session) {
		error(401, 'Unauthorized');
	}

	const body = await event.request.json();
	const query = typeof body.query === 'string' ? body.query.trim() : '';
	const imageHash = typeof body.imageHash === 'string' ? body.imageHash.trim() : '';
	const typeFilter = typeof body.type === 'string' ? body.type : null;
	const groupId = typeof body.groupId === 'string' ? body.groupId : null;
	const threshold = typeof body.threshold === 'number' ? body.threshold : 10;

	const userId = session.user.id;

	if (imageHash) {
		const similar = await findSimilarImages(userId, imageHash, threshold);
		return json({ items: similar, groups: [], notes: [] });
	}

	if (!query) {
		return json({ items: [], groups: [], notes: [] });
	}

	const searchTerm = `%${query}%`;
	const tsQuery = sql`plainto_tsquery('indonesian', ${query})`;
	const tsVector = sql`to_tsvector('indonesian', ${items.name})`;
	const groupTsVector = sql`to_tsvector('indonesian', coalesce(${groups.name}, '') || ' ' || coalesce(${groups.subtitle}, '') || ' ' || coalesce(${groups.description}, ''))`;

	const itemConditions = [
		eq(items.userId, userId),
		or(
			ilike(items.name, searchTerm),
			sql`${tsVector} @@ ${tsQuery}`
		)
	];

	if (typeFilter) {
		itemConditions.push(eq(items.type, typeFilter));
	}

	if (groupId) {
		const ownedGroup = await db
			.select({ id: groups.id })
			.from(groups)
			.where(and(eq(groups.id, groupId), eq(groups.userId, userId)))
			.then((r) => r[0]);

		if (!ownedGroup) {
			error(404, 'Group not found');
		}

		const groupItemIds = db
			.select({ itemId: itemGroups.itemId })
			.from(itemGroups)
			.where(eq(itemGroups.groupId, groupId))
			.as('group_item_ids');

		itemConditions.push(sql`${items.id} IN (SELECT item_id FROM ${groupItemIds})`);
	}

	const [matchedItems, matchedGroups, matchedNotes] = await Promise.all([
		db
			.select()
			.from(items)
			.where(and(...itemConditions))
			.orderBy(sql`${tsVector} @@ ${tsQuery} DESC, ${items.createdAt} DESC`)
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
						ilike(groups.description, searchTerm),
						sql`${groupTsVector} @@ ${tsQuery}`
					)
				)
			)
			.orderBy(sql`${groupTsVector} @@ ${tsQuery} DESC, ${groups.name} ASC`)
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
					sql`to_tsvector('indonesian', coalesce(${ocrNotes.content}, '')) @@ ${tsQuery}`
				)
			)
			.orderBy(sql`ts_rank(to_tsvector('indonesian', coalesce(${ocrNotes.content}, '')), ${tsQuery}) DESC`)
			.limit(20)
	]);

	return json({
		items: matchedItems,
		groups: matchedGroups,
		notes: matchedNotes
	});
};
