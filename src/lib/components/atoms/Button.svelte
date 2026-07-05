<script lang="ts">
	import type { Snippet } from 'svelte';

	type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
	type Size = 'sm' | 'md' | 'lg';

	type Props = {
		variant?: Variant;
		size?: Size;
		disabled?: boolean;
		loading?: boolean;
		type?: 'button' | 'submit' | 'reset';
		onclick?: (e: MouseEvent) => void;
		children?: Snippet;
		class?: string;
	};

	let {
		variant = 'primary',
		size = 'md',
		disabled = false,
		loading = false,
		type = 'button',
		onclick,
		children,
		class: className = ''
	}: Props = $props();

	const base = 'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed';

	const variants: Record<Variant, string> = {
		primary: 'bg-primary text-white hover:bg-primary-hover',
		secondary: 'border border-border-hover text-text-secondary hover:bg-bg-hover',
		ghost: 'text-text-secondary hover:bg-bg-hover',
		danger: 'bg-danger text-white hover:bg-danger/80'
	};

	const sizes: Record<Size, string> = {
		sm: 'px-3 py-1.5 text-xs',
		md: 'px-4 py-2 text-sm',
		lg: 'px-5 py-2.5 text-base'
	};
</script>

<button
	{type}
	{disabled}
	{onclick}
	class="{base} {variants[variant]} {sizes[size]} {className}"
>
	{#if loading}
		<svg class="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
			<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
			<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
		</svg>
	{/if}
	{#if children}{@render children()}{/if}
</button>
