<script lang="ts">
	import type { Snippet } from 'svelte';

	type Variant = 'default' | 'success' | 'warning' | 'danger';

	type Props = {
		variant?: Variant;
		children?: Snippet;
		class?: string;
	};

	let { variant = 'default', children, class: className = '' }: Props = $props();

	const variants: Record<Variant, string> = {
		default: 'bg-slate-800 light:bg-slate-100 text-slate-400 light:text-slate-500',
		success: 'bg-emerald-500/10 text-emerald-400',
		warning: 'bg-amber-500/10 text-amber-400',
		danger: 'bg-red-500/10 text-red-400'
	};
</script>

<span class="shrink-0 rounded-md px-2 py-0.5 text-xs {variants[variant]} {className}">
	{#if children}{@render children()}{/if}
</span>
