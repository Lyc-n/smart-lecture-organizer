<script lang="ts">
	import ProgressBar from '$lib/components/atoms/ProgressBar.svelte';
	import { formatSize } from '$lib/utils/format';

	type Props = {
		used?: number;
		limit?: number;
	};

	let { used = 0, limit = 52428800 }: Props = $props();

	let storageUsed = $state(0);
	let storageLimit = $state(52428800);

	let storagePct = $derived(Math.min(Math.round((storageUsed / storageLimit) * 100), 100));

	let fetched = $state(false);

	$effect(() => {
		if (!fetched && used === 0 && limit === 52428800) {
			fetched = true;
			fetch('/api/storage')
				.then((r) => r.json())
				.then((data) => {
					storageUsed = data.used ?? 0;
					storageLimit = data.limit ?? 52428800;
				})
				.catch((e: unknown) => {
					console.error('Storage fetch failed', e);
				});
		}
	});
</script>

<div class="hidden items-center gap-2 sm:flex">
	<ProgressBar value={storagePct} size="sm" class="w-20" />
	<span class="text-xs text-text-muted">{formatSize(storageUsed)}</span>
</div>
