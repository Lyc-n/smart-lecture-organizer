interface CacheEntry<T> {
	value: T;
	expiresAt: number;
}

export class TTLCache {
	private store = new Map<string, CacheEntry<unknown>>();
	private defaultTTL: number;

	constructor(defaultTTL = 30_000) {
		this.defaultTTL = defaultTTL;
	}

	get<T>(key: string): T | undefined {
		const entry = this.store.get(key);
		if (!entry) return undefined;
		if (Date.now() > entry.expiresAt) {
			this.store.delete(key);
			return undefined;
		}
		return entry.value as T;
	}

	set<T>(key: string, value: T, ttl?: number): void {
		this.store.set(key, {
			value,
			expiresAt: Date.now() + (ttl ?? this.defaultTTL)
		});
	}

	invalidate(pattern: string): void {
		const regex = new RegExp(pattern);
		for (const key of this.store.keys()) {
			if (regex.test(key)) {
				this.store.delete(key);
			}
		}
	}

	clear(): void {
		this.store.clear();
	}
}

export const cache = new TTLCache();

export function cached<T>(key: string, fn: () => Promise<T>, ttl?: number): Promise<T> {
	const existing = cache.get<T>(key);
	if (existing !== undefined) return Promise.resolve(existing);

	return fn().then((value) => {
		cache.set(key, value, ttl);
		return value;
	});
}
