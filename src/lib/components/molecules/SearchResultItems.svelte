<script lang="ts">
	import { goto } from '$app/navigation';
	import { formatSize } from '$lib/utils/format';
	import type { SearchItem } from '$lib/types/search';

	let { items, hasMore, loadingMore, onLoadMore }: {
		items: SearchItem[];
		hasMore: boolean;
		loadingMore: boolean;
		onLoadMore: () => void;
	} = $props();
</script>

<section class="mb-6">
	<h2 class="mb-3 text-sm font-semibold text-text-secondary uppercase tracking-wider">Item ({items.length})</h2>
	<div class="flex flex-col gap-2">
		{#each items as item (item.id)}
			<button
				type="button"
				onclick={() => goto(`/app/items/${item.id}`)}
				class="flex items-center gap-3 rounded-xl bg-bg-elevated border border-border-main p-3 text-left transition hover:border-border-hover"
			>
				<div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-bg-hover text-text-muted">
					<svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
					</svg>
				</div>
				<div class="min-w-0 flex-1">
					<div class="truncate text-sm font-medium text-text-base">{item.name}</div>
					<div class="text-xs text-text-muted">{item.type} &middot; {formatSize(item.fileSize)}</div>
				</div>
			</button>
		{/each}
	</div>
	{#if hasMore}
		<button
			type="button"
			onclick={onLoadMore}
			disabled={loadingMore}
			class="mt-3 w-full rounded-xl border border-border-main bg-bg-elevated py-2.5 text-sm font-medium text-text-secondary transition hover:border-border-hover disabled:opacity-50"
		>
			{loadingMore ? 'Memuat...' : 'Muat lebih banyak item'}
		</button>
	{/if}
</section>
