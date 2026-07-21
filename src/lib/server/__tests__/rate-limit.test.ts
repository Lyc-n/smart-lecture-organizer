import { describe, it, expect, beforeEach } from 'vitest';
import { checkRateLimit } from '../rate-limit';

describe('checkRateLimit', () => {
	beforeEach(() => {
		// Reset by using unique keys
	});

	it('allows requests within limit', () => {
		const result = checkRateLimit('test-1', { maxRequests: 3, windowMs: 60_000 });
		expect(result.allowed).toBe(true);
		expect(result.remaining).toBe(2);
	});

	it('blocks requests over limit', () => {
		const key = 'test-block-' + Date.now();
		checkRateLimit(key, { maxRequests: 2, windowMs: 60_000 });
		checkRateLimit(key, { maxRequests: 2, windowMs: 60_000 });
		const result = checkRateLimit(key, { maxRequests: 2, windowMs: 60_000 });

		expect(result.allowed).toBe(false);
		expect(result.remaining).toBe(0);
		expect(result.retryAfterMs).toBeGreaterThan(0);
	});

	it('resets after window expires', async () => {
		const key = 'test-reset-' + Date.now();
		const config = { maxRequests: 1, windowMs: 50 };

		checkRateLimit(key, config);
		const blocked = checkRateLimit(key, config);
		expect(blocked.allowed).toBe(false);

		await new Promise((r) => setTimeout(r, 60));
		const after = checkRateLimit(key, config);
		expect(after.allowed).toBe(true);
	});
});
