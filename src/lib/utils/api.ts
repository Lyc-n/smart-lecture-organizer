const BASE = '';

type RequestOptions = {
	headers?: Record<string, string>;
};

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

	return await res.json();
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
