<script lang="ts">
	import ProgressBar from '$lib/components/atoms/ProgressBar.svelte';

	type Props = {
		used?: number;
		limit?: number;
	};

	let { used = 0, limit = 52428800 }: Props = $props();

	let storageUsed = $state(used);
	let storageLimit = $state(limit);

	let storagePct = $derived(Math.min(Math.round((storageUsed / storageLimit) * 100), 100));

	function formatBytes(bytes: number): string {
		if (bytes === 0) return '0';
		const units = ['B', 'KB', 'MB', 'GB'];
		const i = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
		const value = bytes / Math.pow(1024, i);
		return `${value.toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
	}

	$effect(() => {
		if (used === 0 && limit === 52428800) {
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
	<span class="text-xs text-slate-500 light:text-slate-400">{formatBytes(storageUsed)}</span>
</div>
