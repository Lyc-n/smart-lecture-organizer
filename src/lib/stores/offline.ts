import { openDB, type IDBPDatabase } from 'idb';

const DB_NAME = 'slo-offline';
const DB_VERSION = 2;

type StoreName = 'groups' | 'items' | 'tasks';

interface SyncMutation {
	id?: number;
	method: 'POST' | 'PATCH' | 'DELETE';
	path: string;
	body?: unknown;
	timestamp: number;
}

interface WatcherState {
	id: 'watcher';
	handle: FileSystemDirectoryHandle | null;
	fileList: string[];
	folderName: string;
}

let dbPromise: Promise<IDBPDatabase<unknown>> | null = null;
let watchInterval: ReturnType<typeof setInterval> | null = null;
let watchCallbacks: Array<(name: string) => void> = [];

function getDb(): Promise<IDBPDatabase<unknown>> {
	if (!dbPromise) {
		dbPromise = openDB(DB_NAME, DB_VERSION, {
			upgrade(db, oldVersion) {
				for (const store of ['groups', 'items', 'tasks']) {
					if (!db.objectStoreNames.contains(store)) {
						db.createObjectStore(store, { keyPath: 'id' });
					}
				}
				if (!db.objectStoreNames.contains('sync_queue')) {
					const queueStore = db.createObjectStore('sync_queue', {
						keyPath: 'id',
						autoIncrement: true
					});
					queueStore.createIndex('timestamp', 'timestamp');
				}
				if (!db.objectStoreNames.contains('watcher_state')) {
					db.createObjectStore('watcher_state', { keyPath: 'id' });
				}
			}
		});
	}
	return dbPromise;
}

export async function cacheMetadata<T extends { id: string }>(store: StoreName, data: T | T[]): Promise<void> {
	const db = await getDb();
	const tx = db.transaction(store, 'readwrite');
	const storeObj = tx.objectStore(store);
	const items = Array.isArray(data) ? data : [data];
	for (const item of items) {
		await storeObj.put(item);
	}
	await tx.done;
}

export async function getCached<T>(store: StoreName, id: string): Promise<T | undefined> {
	const db = await getDb();
	return (await db.get(store, id)) as T | undefined;
}

export async function getAllCached<T>(store: StoreName): Promise<T[]> {
	const db = await getDb();
	return (await db.getAll(store)) as T[];
}

export async function addToSyncQueue(mutation: Omit<SyncMutation, 'id' | 'timestamp'>): Promise<void> {
	const db = await getDb();
	await db.add('sync_queue', { ...mutation, timestamp: Date.now() });
}

export async function getSyncQueue(): Promise<SyncMutation[]> {
	const db = await getDb();
	const index = db.transaction('sync_queue', 'readonly').store.index('timestamp');
	return (await index.getAll()) as SyncMutation[];
}

export async function removeFromSyncQueue(id: number): Promise<void> {
	const db = await getDb();
	await db.delete('sync_queue', id);
}

export async function clearSyncQueue(): Promise<void> {
	const db = await getDb();
	await db.clear('sync_queue');
}

export async function replaySyncQueue(): Promise<void> {
	const queue = await getSyncQueue();
	for (const mutation of queue) {
		try {
			const res = await fetch(mutation.path, {
				method: mutation.method,
				headers: { 'Content-Type': 'application/json' },
				body: mutation.body ? JSON.stringify(mutation.body) : undefined
			});
			if (res.ok && mutation.id !== undefined) {
				await removeFromSyncQueue(mutation.id);
			}
		} catch {
			break;
		}
	}
}

export async function downloadForOffline(url: string): Promise<void> {
	const response = await fetch(url);
	if (!response.ok) throw new Error('Gagal mengunduh file');
	const cache = await caches.open('slo-downloads');
	await cache.put(url, response);
}

export async function saveDirectoryHandle(handle: FileSystemDirectoryHandle): Promise<void> {
	const db = await getDb();
	const state: WatcherState = {
		id: 'watcher',
		handle,
		fileList: [],
		folderName: handle.name
	};
	await db.put('watcher_state', state);
}

export async function getWatcherState(): Promise<WatcherState | undefined> {
	const db = await getDb();
	const state = await db.get('watcher_state', 'watcher') as WatcherState | undefined;
	if (state?.handle) {
		try {
			const handleWithPerm = state.handle as FileSystemDirectoryHandle & { requestPermission(opts: { mode: 'read' }): Promise<'granted' | 'denied' | 'prompt'> };
		if ((await handleWithPerm.requestPermission({ mode: 'read' })) !== 'granted') {
				return undefined;
			}
		} catch {
			return undefined;
		}
	}
	return state;
}

export async function removeWatcherState(): Promise<void> {
	stopFileWatcher();
	const db = await getDb();
	await db.delete('watcher_state', 'watcher');
}

export function onNewFile(cb: (name: string) => void): () => void {
	watchCallbacks.push(cb);
	return () => {
		watchCallbacks = watchCallbacks.filter((f) => f !== cb);
	};
}

export async function startFileWatcher(): Promise<void> {
	const state = await getWatcherState();
	if (!state?.handle) throw new Error('Folder belum dipilih');

	const dirHandle = state.handle;
	const db = await getDb();

	async function poll() {
		try {
			const newNames: string[] = [];
			for await (const entry of dirHandle.values()) {
				if (entry.kind === 'file') {
					newNames.push(entry.name);
				}
			}

			const current = await db.get('watcher_state', 'watcher') as WatcherState | undefined;
			const oldNames = current?.fileList ?? [];

			for (const name of newNames) {
				if (!oldNames.includes(name)) {
					watchCallbacks.forEach((cb) => cb(name));
				}
			}

			await db.put('watcher_state', { id: 'watcher', handle: dirHandle, fileList: newNames, folderName: dirHandle.name });
		} catch {
			stopFileWatcher();
		}
	}

	await poll();
	watchInterval = setInterval(poll, 30000);
}

export function stopFileWatcher(): void {
	if (watchInterval) {
		clearInterval(watchInterval);
		watchInterval = null;
	}
	watchCallbacks = [];
}
