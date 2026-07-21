<script lang="ts">
	import ProgressBar from '$lib/components/atoms/ProgressBar.svelte';
	import { formatSize } from '$lib/utils/format';
	import { STORAGE_LIMIT } from '$lib/constants';

	type Props = {
		used?: number;
		limit?: number;
	};

	let { used = 0, limit = STORAGE_LIMIT }: Props = $props();

	let storageUsed = $state(0);
	let storageLimit = $state(STORAGE_LIMIT);

	let storagePct = $derived(Math.min(Math.round((storageUsed / storageLimit) * 100), 100));

	let fetched = $state(false);
	let loading = $state(false);

	$effect(() => {
		if (!fetched && used === 0 && limit === STORAGE_LIMIT) {
			fetched = true;
			loading = true;
			fetch('/api/storage')
				.then((r) => r.json())
				.then((data) => {
					storageUsed = data.used ?? 0;
					storageLimit = data.limit ?? STORAGE_LIMIT;
				})
				.catch((e: unknown) => {
					console.error('Storage fetch failed', e);
				})
				.finally(() => {
					loading = false;
				});
		}
	});
</script>

<div class="hidden items-center gap-2 sm:flex">
	{#if loading}
		<div class="h-2 w-20 animate-pulse rounded-full bg-bg-hover"></div>
		<span class="text-xs text-text-muted">...</span>
	{:else}
		<ProgressBar value={storagePct} size="sm" class="w-20" />
		<span class="text-xs text-text-muted">{formatSize(storageUsed)}</span>
	{/if}
</div>
