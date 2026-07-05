<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import Icon from '$lib/components/atoms/Icon.svelte';

	const bookmarks = $derived($page.data.bookmarks ?? []);

	function formatDate(date: string | Date): string {
		return new Date(date).toLocaleDateString('id-ID', {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		});
	}
</script>

<svelte:head>
	<title>Bookmark — Smart Lecture Organizer</title>
</svelte:head>

<div class="min-h-screen bg-bg-surface text-text-base p-8">
	<div class="mx-auto max-w-2xl">
		<h1 class="mb-6 text-2xl font-bold">Bookmark</h1>

		{#if bookmarks.length === 0}
			<div class="rounded-xl bg-bg-elevated border border-border-main p-8 text-center">
				<div
					class="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-bg-hover"
				>
					<svg class="h-7 w-7 text-text-muted" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
					</svg>
				</div>
				<p class="text-text-secondary">Belum ada bookmark. Bookmark item atau grup untuk akses cepat.</p>
			</div>
		{:else}
			<div class="flex flex-col gap-2">
				{#each bookmarks as bm (bm.id)}
					{#if bm.itemId}
						<button
							type="button"
							onclick={() => goto(`/app/items/${bm.itemId}`)}
							class="flex w-full items-center gap-3 rounded-xl bg-bg-elevated border border-border-main p-3 text-left transition hover:border-border-hover"
						>
							<div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-bg-hover text-text-muted">
								<svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
								</svg>
							</div>
							<div class="min-w-0 flex-1">
								<div class="truncate text-sm font-medium text-text-base">{bm.itemName}</div>
								<div class="text-xs text-text-muted">Item &middot; {formatDate(bm.createdAt)}</div>
							</div>
						</button>
					{:else if bm.groupId}
						<button
							type="button"
							onclick={() => goto(`/app/groups/${bm.groupId}`)}
							class="flex w-full items-center gap-3 rounded-xl bg-bg-elevated border border-border-main p-3 text-left transition hover:border-border-hover"
						>
							<div
								class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
								style="background-color: {bm.groupColor}20"
							>
								<Icon name={bm.groupIcon!} color={bm.groupColor!} />
							</div>
							<div class="min-w-0 flex-1">
								<div class="truncate text-sm font-medium text-text-base">{bm.groupName}</div>
								<div class="text-xs text-text-muted">Grup &middot; {formatDate(bm.createdAt)}</div>
							</div>
						</button>
					{/if}
				{/each}
			</div>
		{/if}
	</div>
</div>
