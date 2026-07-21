import { describe, it, expect, vi, beforeEach } from 'vitest';
import { cached, cache } from '../cache';

beforeEach(() => {
	cache.invalidate('.*');
});

describe('cached', () => {
	it('caches function result', async () => {
		let callCount = 0;
		const fn = async () => {
			callCount++;
			return 'result';
		};

		const r1 = await cached('test-key', fn, 60_000);
		const r2 = await cached('test-key', fn, 60_000);

		expect(r1).toBe('result');
		expect(r2).toBe('result');
		expect(callCount).toBe(1);
	});

	it('expires after TTL', async () => {
		let callCount = 0;
		const fn = async () => {
			callCount++;
			return 'result';
		};

		await cached('test-ttl', fn, 1);
		await new Promise((r) => setTimeout(r, 10));
		await cached('test-ttl', fn, 1);

		expect(callCount).toBe(2);
	});

	it('invalidates by pattern', async () => {
		let callCount = 0;
		const fn = async () => {
			callCount++;
			return 'result';
		};

		await cached('groups:user1', fn, 60_000);
		cache.invalidate('groups:user1');
		await cached('groups:user1', fn, 60_000);

		expect(callCount).toBe(2);
	});
});
