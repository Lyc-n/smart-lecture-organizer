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
		default: 'bg-bg-elevated text-text-secondary',
		success: 'bg-success/10 text-success',
		warning: 'bg-tertiary/10 text-tertiary',
		danger: 'bg-danger/10 text-danger'
	};
</script>

<span class="shrink-0 rounded-md px-2 py-0.5 text-xs {variants[variant]} {className}">
	{#if children}{@render children()}{/if}
</span>
