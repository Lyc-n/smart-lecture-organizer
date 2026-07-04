/// <reference types="@sveltejs/kit" />
/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />
/// <reference lib="webworker" />

import { build, files, version } from '$service-worker';

const sw = self as unknown as ServiceWorkerGlobalScope;

const CACHE_PREFIX = 'slo-cache';
const CACHE_STATIC = `${CACHE_PREFIX}-static-${version}`;
const CACHE_FILES = `${CACHE_PREFIX}-files-${version}`;
const CACHE_API = `${CACHE_PREFIX}-api-${version}`;

const staticAssets = [...build, ...files];

sw.addEventListener('install', (event) => {
	event.waitUntil(
		caches.open(CACHE_STATIC).then((cache) => cache.addAll(staticAssets))
	);
	sw.skipWaiting();
});

const CACHE_DOWNLOADS = 'slo-downloads';

sw.addEventListener('activate', (event) => {
	event.waitUntil(
		caches.keys().then((keys) =>
			Promise.all(
				keys
					.filter((key) => key.startsWith(CACHE_PREFIX) && key !== CACHE_STATIC && key !== CACHE_FILES && key !== CACHE_API && key !== CACHE_DOWNLOADS)
					.map((key) => caches.delete(key))
			)
		)
	);
	sw.clients.claim();
});

function isUploadThingUrl(url: URL): boolean {
	return url.hostname.includes('uploadthing.com') || url.pathname.startsWith('/file/');
}

function isApiUrl(url: URL): boolean {
	return url.pathname.startsWith('/api/');
}

function isStaticAsset(url: URL): boolean {
	return staticAssets.includes(url.pathname);
}

sw.addEventListener('fetch', (event) => {
	const url = new URL(event.request.url);

	if (isStaticAsset(url)) {
		event.respondWith(
			caches.match(event.request).then((cached) => cached ?? fetch(event.request))
		);
		return;
	}

	if (isUploadThingUrl(url)) {
		event.respondWith(
			caches.open(CACHE_DOWNLOADS).then((downloadsCache) =>
				downloadsCache.match(event.request).then((downloaded) => {
					if (downloaded) return downloaded;
					return caches.open(CACHE_FILES).then((cache) =>
						cache.match(event.request).then((cached) => {
							if (cached) return cached;
							return fetch(event.request).then((response) => {
								if (response.ok) cache.put(event.request, response.clone());
								return response;
							});
						})
					);
				})
			)
		);
		return;
	}

	if (isApiUrl(url)) {
		event.respondWith(
			caches.open(CACHE_API).then((cache) =>
				fetch(event.request)
					.then((response) => {
						if (response.ok) cache.put(event.request, response.clone());
						return response;
					})
					.catch(() => cache.match(event.request).then((cached) => {
						if (cached) return cached;
						return new Response(JSON.stringify({ error: 'Anda sedang offline' }), {
							status: 503,
							headers: { 'Content-Type': 'application/json' }
						});
					}))
			)
		);
		return;
	}

	event.respondWith(
		caches.match(event.request).then((cached) => cached ?? fetch(event.request))
	);
});
