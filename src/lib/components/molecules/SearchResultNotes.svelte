<script lang="ts">
	import { goto } from '$app/navigation';
	import type { SearchNote } from '$lib/types/search';

	let { notes, hasMore, loadingMore, onLoadMore }: {
		notes: SearchNote[];
		hasMore: boolean;
		loadingMore: boolean;
		onLoadMore: () => void;
	} = $props();
</script>

<section class="mb-6">
	<h2 class="mb-3 text-sm font-semibold text-text-secondary uppercase tracking-wider">Catatan OCR ({notes.length})</h2>
	<div class="flex flex-col gap-2">
		{#each notes as entry (entry.itemId + entry.note.id)}
			<button
				type="button"
				onclick={() => goto(`/app/items/${entry.itemId}`)}
				class="rounded-xl bg-bg-elevated border border-border-main p-3 text-left transition hover:border-border-hover"
			>
				<div class="text-sm font-medium text-text-base">{entry.itemName}</div>
				<div class="mt-1 line-clamp-2 text-xs text-text-muted">{entry.note?.content?.slice(0, 200)}</div>
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
			{loadingMore ? 'Memuat...' : 'Muat lebih banyak catatan'}
		</button>
	{/if}
</section>
