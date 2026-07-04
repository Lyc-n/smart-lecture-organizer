<script lang="ts">
	import MagnifyingGlassIcon from 'phosphor-svelte/lib/MagnifyingGlassIcon';
	import { goto } from '$app/navigation';

	let { onclick }: { onclick?: () => void } = $props();
</script>

<button
	type="button"
	onclick={() => { goto('/app/search'); onclick?.(); }}
	class="hidden items-center gap-2 rounded-lg border border-slate-700 light:border-slate-300 px-3 py-1.5 text-sm text-slate-500 light:text-slate-400 transition hover:border-slate-600 light:hover:border-slate-400 hover:text-slate-300 light:hover:text-slate-600 sm:flex"
>
	<MagnifyingGlassIcon size={16} />
	Cari...
</button>
