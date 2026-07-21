interface RateLimitEntry {
	timestamps: number[];
}

export interface RateLimitConfig {
	maxRequests: number;
	windowMs: number;
}

const store = new Map<string, RateLimitEntry>();

function cleanup(key: string, windowMs: number) {
	const entry = store.get(key);
	if (!entry) return;

	const cutoff = Date.now() - windowMs;
	entry.timestamps = entry.timestamps.filter((t) => t > cutoff);

	if (entry.timestamps.length === 0) {
		store.delete(key);
	}
}

export function checkRateLimit(
	key: string,
	config: RateLimitConfig
): { allowed: boolean; remaining: number; retryAfterMs: number } {
	const { maxRequests, windowMs } = config;

	cleanup(key, windowMs);

	const entry = store.get(key);
	const now = Date.now();
	const timestamps = entry?.timestamps ?? [];

	if (timestamps.length >= maxRequests) {
		const oldest = timestamps[0];
		const retryAfterMs = oldest + windowMs - now;
		return { allowed: false, remaining: 0, retryAfterMs: Math.max(retryAfterMs, 1000) };
	}

	if (!entry) {
		store.set(key, { timestamps: [now] });
	} else {
		entry.timestamps.push(now);
	}

	return { allowed: true, remaining: maxRequests - timestamps.length - 1, retryAfterMs: 0 };
}

export function rateLimit(
	request: Request,
	config: RateLimitConfig
): { allowed: boolean; remaining: number; retryAfterMs: number } {
	const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
		?? request.headers.get('x-real-ip')
		?? 'unknown';

	const url = new URL(request.url);
	const key = `${ip}:${url.pathname}`;

	return checkRateLimit(key, config);
}

export const RATE_LIMITS = {
	search: { maxRequests: 20, windowMs: 60_000 },
	ocr: { maxRequests: 10, windowMs: 60_000 },
	upload: { maxRequests: 30, windowMs: 60_000 },
	default: { maxRequests: 60, windowMs: 60_000 }
} as const;
