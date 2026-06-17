import { describe, it, expect } from 'vitest';
import { formatRelativeTime } from './format-relative-time';

describe('formatRelativeTime', () => {
	it('returns "just now" for < 60 seconds', () => {
		expect(formatRelativeTime(new Date())).toBe('just now');
	});

	it('returns minutes for < 60 minutes', () => {
		const date = new Date(Date.now() - 5 * 60 * 1000);
		expect(formatRelativeTime(date)).toBe('5 minutes ago');
	});

	it('returns "1 minute ago" for singular', () => {
		const date = new Date(Date.now() - 60 * 1000);
		expect(formatRelativeTime(date)).toBe('1 minute ago');
	});

	it('returns hours for < 24 hours', () => {
		const date = new Date(Date.now() - 3 * 3600 * 1000);
		expect(formatRelativeTime(date)).toBe('3 hours ago');
	});

	it('returns days for < 7 days', () => {
		const date = new Date(Date.now() - 2 * 86400 * 1000);
		expect(formatRelativeTime(date)).toBe('2 days ago');
	});

	it('returns formatted date for >= 7 days', () => {
		const date = new Date('2024-01-15');
		const result = formatRelativeTime(date);
		expect(result).toMatch(/Jan 15, 2024/);
	});

	it('accepts string date input', () => {
		expect(formatRelativeTime(new Date().toISOString())).toBe('just now');
	});
});
