import { db } from '$lib/server/db';
import { items, groups, ocrNotes, itemGroups } from '$lib/server/db/schema';
import { eq, and, or, sql, ilike } from 'drizzle-orm';
import { PAGE_SIZE, type Section, type SearchResult } from '$lib/types/search';

type SearchOptions = {
	page?: number;
	section?: Section | null;
	typeFilter?: string | null;
	groupId?: string | null;
};

export async function search(userId: string, query: string, options: SearchOptions = {}): Promise<SearchResult> {
	const { page = 0, section = null, typeFilter = null, groupId = null } = options;

	if (!query) {
		return { items: [], groups: [], notes: [], hasMoreItems: false, hasMoreGroups: false, hasMoreNotes: false };
	}

	const searchTerm = `%${query}%`;
	const tsQuery = sql`plainto_tsquery('indonesian', ${query})`;
	const tsVector = sql`to_tsvector('indonesian', ${items.name})`;
	const groupTsVector = sql`to_tsvector('indonesian', coalesce(${groups.name}, '') || ' ' || coalesce(${groups.subtitle}, '') || ' ' || coalesce(${groups.description}, ''))`;

	const offset = page * PAGE_SIZE;
	const fetchLimit = PAGE_SIZE + 1;

	const itemConditions = [
		eq(items.userId, userId),
		or(
			ilike(items.name, searchTerm),
			sql`${tsVector} @@ ${tsQuery}`
		)
	];

	if (typeFilter) {
		itemConditions.push(eq(items.type, typeFilter as 'document' | 'audio' | 'video' | 'image' | 'note'));
	}

	if (groupId) {
		const groupItemIds = db
			.select({ itemId: itemGroups.itemId })
			.from(itemGroups)
			.where(eq(itemGroups.groupId, groupId))
			.as('group_item_ids');

		itemConditions.push(sql`${items.id} IN (SELECT item_id FROM ${groupItemIds})`);
	}

	const runItems = !section || section === 'items';
	const runGroups = !section || section === 'groups';
	const runNotes = !section || section === 'notes';

	const [rawItems, rawGroups, rawNotes] = await Promise.all([
		runItems
			? db
				.select()
				.from(items)
				.where(and(...itemConditions))
				.orderBy(sql`${tsVector} @@ ${tsQuery} DESC, ${items.createdAt} DESC`)
				.limit(fetchLimit)
				.offset(offset)
			: Promise.resolve([]),
		runGroups
			? db
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
				.limit(fetchLimit)
				.offset(offset)
			: Promise.resolve([]),
		runNotes
			? db
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
				.limit(fetchLimit)
				.offset(offset)
			: Promise.resolve([])
	]);

	return {
		items: rawItems.slice(0, PAGE_SIZE),
		groups: rawGroups.slice(0, PAGE_SIZE),
		notes: rawNotes.slice(0, PAGE_SIZE),
		hasMoreItems: rawItems.length > PAGE_SIZE,
		hasMoreGroups: rawGroups.length > PAGE_SIZE,
		hasMoreNotes: rawNotes.length > PAGE_SIZE
	};
}
