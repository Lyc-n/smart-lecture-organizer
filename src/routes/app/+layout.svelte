<script lang="ts">
	import { page } from '$app/stores';
	import AppShell from '$lib/components/organisms/AppShell.svelte';

	let { children }: { children: import('svelte').Snippet } = $props();

	const overdueCount = $derived($page.data.overdueCount ?? 0);
</script>

<AppShell {overdueCount}>
	{@render children()}
</AppShell>
