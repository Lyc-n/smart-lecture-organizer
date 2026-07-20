export interface PaginationParams {
	page: number;
	limit: number;
}

export interface PaginatedResult<T> {
	data: T[];
	total: number;
	page: number;
	limit: number;
	hasMore: boolean;
}

export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;

export function parsePagination(url: URL): PaginationParams {
	const page = Math.max(0, parseInt(url.searchParams.get('page') ?? '0', 10) || 0);
	const limit = Math.min(
		MAX_PAGE_SIZE,
		Math.max(1, parseInt(url.searchParams.get('limit') ?? String(DEFAULT_PAGE_SIZE), 10) || DEFAULT_PAGE_SIZE)
	);
	return { page, limit };
}

export function getOffset(page: number, limit: number): number {
	return page * limit;
}
