<script lang="ts">
	import type { Snippet } from 'svelte';
	import { ICONS } from '$lib/utils/icons';

	type Props = {
		name?: string;
		size?: number | string;
		color?: string;
		class?: string;
		children?: Snippet;
	};

	let { name = 'folder', size = 20, color = 'currentColor', class: className = '', children }: Props = $props();

	const paths = $derived(ICONS[name] ?? ICONS.folder);
</script>

{#if children}
	{@render children()}
{:else if paths}
	<svg
		viewBox="0 0 24 24"
		fill="none"
		stroke={color}
		stroke-width="2"
		stroke-linecap="round"
		stroke-linejoin="round"
		width={size}
		height={size}
		class={className}
	>
		{#each paths as d}
			<path {d} />
		{/each}
	</svg>
{/if}
