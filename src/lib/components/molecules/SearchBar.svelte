<script lang="ts">
	import MagnifyingGlassIcon from 'phosphor-svelte/lib/MagnifyingGlassIcon';
	import { goto } from '$app/navigation';

	let { onclick }: { onclick?: () => void } = $props();
</script>

<button
	type="button"
	onclick={() => { goto('/app/search'); onclick?.(); }}
	class="hidden items-center gap-2 rounded-lg border border-border-hover px-3 py-1.5 text-sm text-text-muted transition hover:border-text-muted hover:text-text-secondary sm:flex"
>
	<MagnifyingGlassIcon size={16} />
	Cari...
</button>
