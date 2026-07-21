<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import SearchResultItems from '$lib/components/molecules/SearchResultItems.svelte';
	import SearchResultGroups from '$lib/components/molecules/SearchResultGroups.svelte';
	import SearchResultNotes from '$lib/components/molecules/SearchResultNotes.svelte';
	import { api } from '$lib/utils/api';
	import { computeImageHash } from '$lib/utils/hash';
	import { formatSize } from '$lib/utils/format';
	import { PAGE_SIZE, type SearchResult } from '$lib/types/search';

	type Tab = 'text' | 'image';

	let activeTab: Tab = $state('text');
	let query = $state(($page.data.query as string) ?? '');
	let results = $state<SearchResult>({
		items: $page.data.items ?? [],
		groups: $page.data.groups ?? [],
		notes: $page.data.notes ?? [],
		hasMoreItems: $page.data.hasMoreItems ?? false,
		hasMoreGroups: $page.data.hasMoreGroups ?? false,
		hasMoreNotes: $page.data.hasMoreNotes ?? false
	});

	let loading = $state(false);
	let loadingMore = $state(false);
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

	function resetResults() {
		results = { items: [], groups: [], notes: [], hasMoreItems: false, hasMoreGroups: false, hasMoreNotes: false };
	}

	function mergeResults(newData: SearchResult, append: boolean, section?: 'items' | 'groups' | 'notes') {
		if (append && section) {
			results = {
				items: section === 'items' ? [...results.items, ...newData.items] : results.items,
				groups: section === 'groups' ? [...results.groups, ...newData.groups] : results.groups,
				notes: section === 'notes' ? [...results.notes, ...newData.notes] : results.notes,
				hasMoreItems: section === 'items' ? newData.hasMoreItems : results.hasMoreItems,
				hasMoreGroups: section === 'groups' ? newData.hasMoreGroups : results.hasMoreGroups,
				hasMoreNotes: section === 'notes' ? newData.hasMoreNotes : results.hasMoreNotes
			};
		} else {
			results = newData;
		}
	}

	async function doSearch(q: string, opts: { page?: number; appendSection?: 'items' | 'groups' | 'notes' } = {}) {
		if (!q.trim()) {
			resetResults();
			return;
		}

		const append = !!opts.appendSection;
		if (append) {
			loadingMore = true;
		} else {
			loading = true;
		}
		error = '';

		try {
			const res = await api.post<SearchResult>('/api/search', {
				query: q,
				page: opts.page ?? 0,
				section: opts.appendSection ?? null
			});
			mergeResults(res, append, opts.appendSection);
		} catch (e) {
			error = (e as Error).message;
			if (!append) resetResults();
		} finally {
			loading = false;
			loadingMore = false;
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
			const res = await api.post<SearchResult>('/api/search', { imageHash: hash, threshold: 10 });
			results = res;
		} catch (e) {
			error = (e as Error).message;
			resetResults();
		} finally {
			loading = false;
		}
	}

	function loadMoreItems() {
		const page = Math.floor(results.items.length / PAGE_SIZE);
		doSearch(query, { page, appendSection: 'items' });
	}

	function loadMoreGroups() {
		const page = Math.floor(results.groups.length / PAGE_SIZE);
		doSearch(query, { page, appendSection: 'groups' });
	}

	function loadMoreNotes() {
		const page = Math.floor(results.notes.length / PAGE_SIZE);
		doSearch(query, { page, appendSection: 'notes' });
	}

	const totalCount = $derived(results.items.length + results.groups.length + results.notes.length);
</script>

<svelte:head>
	<title>Cari — SmartLO</title>
</svelte:head>

<div class="min-h-screen bg-bg-surface text-text-base p-8">
	<div class="mx-auto max-w-2xl">
		<div class="mb-6 flex gap-1 rounded-xl bg-bg-elevated p-1 border border-border-main">
			<button
				type="button"
				class="flex-1 rounded-lg px-4 py-2 text-sm font-medium transition {activeTab === 'text' ? 'bg-primary text-white' : 'text-text-secondary hover:text-text-secondary'}"
				onclick={() => activeTab = 'text'}
			>
				Teks
			</button>
			<button
				type="button"
				class="flex-1 rounded-lg px-4 py-2 text-sm font-medium transition {activeTab === 'image' ? 'bg-primary text-white' : 'text-text-secondary hover:text-text-secondary'}"
				onclick={() => activeTab = 'image'}
			>
				Gambar
			</button>
		</div>

		{#if activeTab === 'text'}
			<div class="relative mb-6">
				<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
					<svg class="h-5 w-5 text-text-muted" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
					</svg>
				</div>
				<input
					bind:this={searchInput}
					type="search"
					value={query}
					oninput={onInput}
					placeholder="Cari grup, item, atau catatan..."
					class="w-full rounded-xl border border-border-hover bg-bg-elevated py-3 pl-10 pr-4 text-sm text-text-base placeholder-text-muted transition focus:border-primary focus:outline-none"
				/>
				{#if loading}
					<div class="absolute inset-y-0 right-0 flex items-center pr-3">
						<svg class="h-5 w-5 animate-spin text-text-muted" fill="none" viewBox="0 0 24 24">
							<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
							<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
						</svg>
					</div>
				{/if}
			</div>
		{:else}
			<div class="mb-6">
				<div class="rounded-xl border border-border-hover bg-bg-elevated p-6">
					{#if imagePreview}
						<div class="mb-4 flex items-center gap-4">
							<img src={imagePreview} alt="Preview" class="h-24 w-24 rounded-lg object-cover border border-border-hover" />
							<div class="text-sm text-text-secondary">
								<p class="font-medium text-text-secondary">{imageFile?.name}</p>
								<p>{formatSize(imageFile?.size ?? 0)}</p>
							</div>
						</div>
						<button
							type="button"
							onclick={() => { imagePreview = undefined; imageFile = undefined; resetResults(); }}
							class="text-sm text-text-muted hover:text-text-secondary transition"
						>
							Ganti gambar
						</button>
					{:else}
						<label class="flex cursor-pointer flex-col items-center gap-3 py-8 text-text-secondary hover:text-text-secondary transition">
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
			<div class="mb-4 rounded-lg bg-danger/50 border border-danger p-4 text-sm text-danger">
				{error}
			</div>
		{/if}

		{#if loading}
			<div class="space-y-3">
				{#each [1, 2, 3] as _}
					<div class="h-16 animate-pulse rounded-xl bg-bg-elevated border border-border-main"></div>
				{/each}
			</div>
		{/if}

		{#if activeTab === 'text' && query && !loading && totalCount === 0}
			<div class="rounded-xl bg-bg-elevated border border-border-main p-8 text-center">
				<div class="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-bg-hover">
					<svg class="h-7 w-7 text-text-muted" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
					</svg>
				</div>
				<p class="text-text-secondary">Tidak ada hasil untuk "{query}".</p>
			</div>
		{/if}

		{#if activeTab === 'image' && results.items.length > 0 && !loading}
			<p class="mb-3 text-sm text-text-secondary">{results.items.length} gambar mirip ditemukan</p>
		{/if}

		{#if activeTab === 'image' && !loading && imagePreview && results.items.length === 0}
			<div class="rounded-xl bg-bg-elevated border border-border-main p-8 text-center">
				<p class="text-text-secondary">Tidak ada gambar yang mirip ditemukan.</p>
			</div>
		{/if}

		{#if results.items.length > 0 && activeTab === 'image'}
			<div class="grid grid-cols-2 gap-3 sm:grid-cols-3">
				{#each results.items as item (item.id)}
					<a
						href="/app/items/{item.id}"
						class="group rounded-xl bg-bg-elevated border border-border-main overflow-hidden transition hover:border-border-hover"
					>
						<div class="aspect-square bg-bg-hover">
							<img
								src={item.fileUrl ?? ''}
								alt={item.name}
								class="h-full w-full object-cover"
								loading="lazy"
							/>
						</div>
						<div class="p-2">
							<div class="truncate text-xs font-medium text-text-secondary">{item.name}</div>
							{#if item.distance !== undefined}
								<div class="text-xs text-primary">
									{(100 - (item.distance / 64) * 100).toFixed(0)}% mirip
								</div>
							{/if}
						</div>
					</a>
				{/each}
			</div>
		{/if}

		{#if activeTab === 'text' && results.items.length > 0}
			<SearchResultItems items={results.items} hasMore={results.hasMoreItems} {loadingMore} onLoadMore={loadMoreItems} />
		{/if}

		{#if activeTab === 'text' && results.groups.length > 0}
			<SearchResultGroups groups={results.groups} hasMore={results.hasMoreGroups} {loadingMore} onLoadMore={loadMoreGroups} />
		{/if}

		{#if activeTab === 'text' && results.notes.length > 0}
			<SearchResultNotes notes={results.notes} hasMore={results.hasMoreNotes} {loadingMore} onLoadMore={loadMoreNotes} />
		{/if}
	</div>
</div>
