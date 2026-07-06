<script lang="ts">
	import Icon from '$lib/components/atoms/Icon.svelte';
	import { goto } from '$app/navigation';

	let { onclick }: { onclick?: () => void } = $props();
</script>

<button
	type="button"
	onclick={() => { goto('/app/search'); onclick?.(); }}
	class="hidden items-center gap-2 rounded-lg border border-border-hover px-3 py-1.5 text-sm text-text-muted transition hover:border-text-muted hover:text-text-secondary sm:flex"
>
	<Icon name="search" size={16} />
	Cari...
</button>
