<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import Icon from '$lib/components/atoms/Icon.svelte';
	import { api } from '$lib/utils/api';
	import { computeImageHash } from '$lib/utils/hash';

	type Tab = 'text' | 'image';
	let activeTab: Tab = $state('text');
	let query = $state(($page.data.query as string) ?? '');
	let results = $state<{
		items: Array<Record<string, unknown>>;
		groups: Array<Record<string, unknown>>;
		notes: Array<Record<string, unknown>>;
	}>($page.data.results as { items: []; groups: []; notes: [] });

	let loading = $state(false);
	let error = $state('');
	let imagePreview: string | undefined = $state();
	let imageFile: File | undefined = $state();

	let searchInput: HTMLInputElement | undefined = $state();

	let debounceTimer: ReturnType<typeof setTimeout> | undefined;

	$effect(() => {
		if (activeTab === 'text' && searchInput) {
			searchInput.focus();
		}
	});

	async function doSearch(q: string) {
		if (!q.trim()) {
			results = { items: [], groups: [], notes: [] };
			return;
		}

		loading = true;
		error = '';

		try {
			const res = await api.post<{
				items: Array<Record<string, unknown>>;
				groups: Array<Record<string, unknown>>;
				notes: Array<Record<string, unknown>>;
			}>('/api/search', { query: q });
			results = res;
		} catch (e) {
			error = (e as Error).message;
			results = { items: [], groups: [], notes: [] };
		} finally {
			loading = false;
		}
	}

	function onInput(e: Event) {
		const q = (e.target as HTMLInputElement).value;
		query = q;

		if (debounceTimer) clearTimeout(debounceTimer);
		debounceTimer = setTimeout(() => {
			const url = new URL($page.url);
			if (q.trim()) {
				url.searchParams.set('q', q.trim());
			} else {
				url.searchParams.delete('q');
			}
			goto(url, { replaceState: true, noScroll: true });
			doSearch(q.trim());
		}, 300);
	}

	async function handleImageSelect(e: Event) {
		const input = e.target as HTMLInputElement;
		const file = input.files?.[0];
		if (!file) return;

		imageFile = file;
		imagePreview = URL.createObjectURL(file);
		loading = true;
		error = '';

		try {
			const hash = await computeImageHash(file);
			const res = await api.post<{
				items: Array<Record<string, unknown>>;
				groups: Array<Record<string, unknown>>;
				notes: Array<Record<string, unknown>>;
			}>('/api/search', { imageHash: hash, threshold: 10 });
			results = res;
		} catch (e) {
			error = (e as Error).message;
			results = { items: [], groups: [], notes: [] };
		} finally {
			loading = false;
		}
	}

	function formatSize(bytes: number | null): string {
		if (!bytes) return '';
		if (bytes < 1024) return `${bytes} B`;
		if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
		return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
	}

	const totalCount = $derived(results.items.length + results.groups.length + results.notes.length);
</script>

<svelte:head>
	<title>Cari — Smart Lecture Organizer</title>
</svelte:head>

<div class="min-h-screen bg-slate-950 light:bg-slate-50 text-slate-100 light:text-slate-900 p-8">
	<div class="mx-auto max-w-2xl">
		<div class="mb-6 flex gap-1 rounded-xl bg-slate-900 light:bg-white p-1 border border-slate-800 light:border-slate-200">
			<button
				type="button"
				class="flex-1 rounded-lg px-4 py-2 text-sm font-medium transition {activeTab === 'text' ? 'bg-indigo-600 text-white' : 'text-slate-400 light:text-slate-500 hover:text-slate-200 light:hover:text-slate-700'}"
				onclick={() => activeTab = 'text'}
			>
				Teks
			</button>
			<button
				type="button"
				class="flex-1 rounded-lg px-4 py-2 text-sm font-medium transition {activeTab === 'image' ? 'bg-indigo-600 text-white' : 'text-slate-400 light:text-slate-500 hover:text-slate-200 light:hover:text-slate-700'}"
				onclick={() => activeTab = 'image'}
			>
				Gambar
			</button>
		</div>

		{#if activeTab === 'text'}
			<div class="relative mb-6">
				<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
					<svg class="h-5 w-5 text-slate-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
					</svg>
				</div>
				<input
					bind:this={searchInput}
					type="search"
					value={query}
					oninput={onInput}
					placeholder="Cari grup, item, atau catatan..."
					class="w-full rounded-xl border border-slate-700 light:border-slate-300 bg-slate-900 light:bg-white py-3 pl-10 pr-4 text-sm text-slate-100 light:text-slate-900 placeholder-slate-500 light:placeholder-slate-400 transition focus:border-indigo-500 focus:outline-none"
				/>
				{#if loading}
					<div class="absolute inset-y-0 right-0 flex items-center pr-3">
						<svg class="h-5 w-5 animate-spin text-slate-500" fill="none" viewBox="0 0 24 24">
							<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
							<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
						</svg>
					</div>
				{/if}
			</div>
		{:else}
			<div class="mb-6">
				<div class="rounded-xl border border-slate-700 light:border-slate-300 bg-slate-900 light:bg-white p-6">
					{#if imagePreview}
						<div class="mb-4 flex items-center gap-4">
							<img src={imagePreview} alt="Preview" class="h-24 w-24 rounded-lg object-cover border border-slate-700 light:border-slate-300" />
							<div class="text-sm text-slate-400 light:text-slate-500">
								<p class="font-medium text-slate-200 light:text-slate-700">{imageFile?.name}</p>
								<p>{formatSize(imageFile?.size ?? 0)}</p>
							</div>
						</div>
						<button
							type="button"
							onclick={() => { imagePreview = undefined; imageFile = undefined; results = { items: [], groups: [], notes: [] }; }}
							class="text-sm text-slate-500 light:text-slate-400 hover:text-slate-300 light:hover:text-slate-600 transition"
						>
							Ganti gambar
						</button>
					{:else}
						<label class="flex cursor-pointer flex-col items-center gap-3 py-8 text-slate-400 light:text-slate-500 hover:text-slate-200 light:hover:text-slate-700 transition">
							<svg class="h-10 w-10" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
							</svg>
							<span class="text-sm">Pilih gambar untuk mencari yang mirip</span>
							<input type="file" accept="image/*" onchange={handleImageSelect} class="hidden" />
						</label>
					{/if}
				</div>
			</div>
		{/if}

		{#if error}
			<div class="mb-4 rounded-lg bg-red-900/50 light:bg-red-100/50 border border-red-800 light:border-red-300 p-4 text-sm text-red-300 light:text-red-700">
				{error}
			</div>
		{/if}

		{#if loading}
			<div class="space-y-3">
				{#each [1, 2, 3] as _}
					<div class="h-16 animate-pulse rounded-xl bg-slate-900 light:bg-white border border-slate-800 light:border-slate-200"></div>
				{/each}
			</div>
		{/if}

		{#if activeTab === 'text' && query && !loading && totalCount === 0}
			<div class="rounded-xl bg-slate-900 light:bg-white border border-slate-800 light:border-slate-200 p-8 text-center">
				<div class="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-800 light:bg-slate-100">
					<svg class="h-7 w-7 text-slate-500" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
					</svg>
				</div>
				<p class="text-slate-400 light:text-slate-500">Tidak ada hasil untuk "{query}".</p>
			</div>
		{/if}

		{#if activeTab === 'image' && results.items.length > 0 && !loading}
			<p class="mb-3 text-sm text-slate-400 light:text-slate-500">{results.items.length} gambar mirip ditemukan</p>
		{/if}

		{#if activeTab === 'image' && !loading && imagePreview && results.items.length === 0}
			<div class="rounded-xl bg-slate-900 light:bg-white border border-slate-800 light:border-slate-200 p-8 text-center">
				<p class="text-slate-400 light:text-slate-500">Tidak ada gambar yang mirip ditemukan.</p>
			</div>
		{/if}

		{#if results.items.length > 0 && activeTab === 'image'}
			<div class="grid grid-cols-2 gap-3 sm:grid-cols-3">
				{#each results.items as item (item.id as string)}
					<button
						type="button"
						onclick={() => goto(`/app/items/${item.id}`)}
						class="group rounded-xl bg-slate-900 light:bg-white border border-slate-800 light:border-slate-200 overflow-hidden transition hover:border-slate-700 light:hover:border-slate-300"
					>
						<div class="aspect-square bg-slate-800 light:bg-slate-200">
							<img
								src={item.fileUrl as string}
								alt={item.name as string}
								class="h-full w-full object-cover"
								loading="lazy"
							/>
						</div>
						<div class="p-2">
							<div class="truncate text-xs font-medium text-slate-200 light:text-slate-700">{item.name as string}</div>
							{#if (item as { distance?: number }).distance !== undefined}
								<div class="text-xs text-indigo-400">
									{(100 - ((item as { distance: number }).distance / 64) * 100).toFixed(0)}% mirip
								</div>
							{/if}
						</div>
					</button>
				{/each}
			</div>
		{/if}

		{#if activeTab === 'text' && results.items.length > 0}
			<section class="mb-6">
				<h2 class="mb-3 text-sm font-semibold text-slate-400 light:text-slate-500 uppercase tracking-wider">Item ({results.items.length})</h2>
				<div class="flex flex-col gap-2">
					{#each results.items as item (item.id as string)}
						<button
							type="button"
							onclick={() => goto(`/app/items/${item.id}`)}
							class="flex items-center gap-3 rounded-xl bg-slate-900 light:bg-white border border-slate-800 light:border-slate-200 p-3 text-left transition hover:border-slate-700 light:hover:border-slate-300"
						>
							<div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-800 light:bg-slate-100 text-slate-500 light:text-slate-400">
								<svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
								</svg>
							</div>
							<div class="min-w-0 flex-1">
								<div class="truncate text-sm font-medium text-slate-100 light:text-slate-900">{item.name as string}</div>
								<div class="text-xs text-slate-500 light:text-slate-400">{item.type as string} &middot; {formatSize(item.fileSize as number | null)}</div>
							</div>
						</button>
					{/each}
				</div>
			</section>
		{/if}

		{#if activeTab === 'text' && results.groups.length > 0}
			<section class="mb-6">
				<h2 class="mb-3 text-sm font-semibold text-slate-400 light:text-slate-500 uppercase tracking-wider">Grup ({results.groups.length})</h2>
				<div class="flex flex-col gap-2">
					{#each results.groups as group (group.id as string)}
						<button
							type="button"
							onclick={() => goto(`/app/groups/${group.id}`)}
							class="flex items-center gap-3 rounded-xl bg-slate-900 light:bg-white border border-slate-800 light:border-slate-200 p-3 text-left transition hover:border-slate-700 light:hover:border-slate-300"
						>
							<div
								class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
								style="background-color: {(group.color as string) ?? '#6366f1'}20"
							>
								<Icon name={(group.icon as string) ?? 'Folder'} color={(group.color as string) ?? '#6366f1'} />
							</div>
							<div class="min-w-0 flex-1">
								<div class="truncate text-sm font-medium text-slate-100 light:text-slate-900">{group.name as string}</div>
								{#if group.subtitle}
									<div class="text-xs text-slate-500 light:text-slate-400">{group.subtitle as string}</div>
								{/if}
							</div>
						</button>
					{/each}
				</div>
			</section>
		{/if}

		{#if activeTab === 'text' && results.notes.length > 0}
			<section class="mb-6">
				<h2 class="mb-3 text-sm font-semibold text-slate-400 light:text-slate-500 uppercase tracking-wider">Catatan OCR ({results.notes.length})</h2>
				<div class="flex flex-col gap-2">
					{#each results.notes as entryRaw, i (i)}
						{@const entry = entryRaw as unknown as { note: { id: string; content: string }; itemId: string; itemName: string }}
						<button
							type="button"
							onclick={() => goto(`/app/items/${entry.itemId}`)}
							class="rounded-xl bg-slate-900 light:bg-white border border-slate-800 light:border-slate-200 p-3 text-left transition hover:border-slate-700 light:hover:border-slate-300"
						>
							<div class="text-sm font-medium text-slate-100 light:text-slate-900">{entry.itemName}</div>
							<div class="mt-1 line-clamp-2 text-xs text-slate-500 light:text-slate-400">{entry.note?.content?.slice(0, 200)}</div>
						</button>
					{/each}
				</div>
			</section>
		{/if}
	</div>
</div>
