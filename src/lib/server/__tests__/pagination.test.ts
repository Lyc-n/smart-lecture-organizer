import { describe, it, expect } from 'vitest';
import { parsePagination, getOffset, DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE } from '../pagination';

function makeUrl(params: Record<string, string> = {}) {
	const url = new URL('http://localhost/api');
	for (const [k, v] of Object.entries(params)) {
		url.searchParams.set(k, v);
	}
	return url;
}

describe('parsePagination', () => {
	it('returns defaults when no params', () => {
		const result = parsePagination(makeUrl());
		expect(result.page).toBe(0);
		expect(result.limit).toBe(DEFAULT_PAGE_SIZE);
	});

	it('parses page and limit', () => {
		const result = parsePagination(makeUrl({ page: '2', limit: '10' }));
		expect(result.page).toBe(2);
		expect(result.limit).toBe(10);
	});

	it('clamps negative values', () => {
		const result = parsePagination(makeUrl({ page: '-1', limit: '-5' }));
		expect(result.page).toBe(0);
		expect(result.limit).toBe(1);
	});

	it('caps limit at MAX_PAGE_SIZE', () => {
		const result = parsePagination(makeUrl({ limit: '999' }));
		expect(result.limit).toBe(MAX_PAGE_SIZE);
	});

	it('handles non-numeric values', () => {
		const result = parsePagination(makeUrl({ page: 'abc', limit: 'xyz' }));
		expect(result.page).toBe(0);
		expect(result.limit).toBe(DEFAULT_PAGE_SIZE);
	});
});

describe('getOffset', () => {
	it('calculates offset correctly', () => {
		expect(getOffset(0, 20)).toBe(0);
		expect(getOffset(1, 20)).toBe(20);
		expect(getOffset(5, 10)).toBe(50);
	});
});
