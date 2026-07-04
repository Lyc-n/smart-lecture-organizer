import { cacheMetadata } from '$lib/stores/offline';

const BASE = '';

type RequestOptions = {
	headers?: Record<string, string>;
};

const STORE_MAP: Record<string, 'groups' | 'items' | 'tasks'> = {
	'/api/groups': 'groups',
	'/api/items': 'items',
	'/api/tasks': 'tasks'
};

function detectStore(path: string): 'groups' | 'items' | 'tasks' | null {
	const base = Object.keys(STORE_MAP).find((key) => path === key || path.startsWith(`${key}/`));
	return base ? STORE_MAP[base] : null;
}

async function request<T>(method: string, path: string, body?: unknown, options?: RequestOptions): Promise<T> {
	const res = await fetch(`${BASE}${path}`, {
		method,
		headers: {
			'Content-Type': 'application/json',
			...options?.headers
		},
		body: body ? JSON.stringify(body) : undefined
	});

	if (!res.ok) {
		const message = await res.json().then((d) => d.message).catch(() => res.statusText);
		throw new Error(message || `Request failed (${res.status})`);
	}

	if (res.status === 204) return undefined as T;

	const data: T = await res.json();

	if (method === 'GET' && typeof data === 'object' && data !== null) {
		const store = detectStore(path);
		if (store) {
			const records = (Array.isArray(data) ? data : [data]) as Array<{ id: string }>;
			const validRecords = records.filter((r) => r?.id);
			if (validRecords.length > 0) {
				cacheMetadata(store, validRecords).catch(() => {});
			}
		}
	}

	return data;
}

export const api = {
	get<T>(path: string, options?: RequestOptions) {
		return request<T>('GET', path, undefined, options);
	},
	post<T>(path: string, body?: unknown, options?: RequestOptions) {
		return request<T>('POST', path, body, options);
	},
	patch<T>(path: string, body?: unknown, options?: RequestOptions) {
		return request<T>('PATCH', path, body, options);
	},
	del<T = void>(path: string, options?: RequestOptions) {
		return request<T>('DELETE', path, undefined, options);
	}
};
