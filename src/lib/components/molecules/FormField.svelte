<script lang="ts">
	import type { Snippet } from 'svelte';

	type Props = {
		label?: string;
		id?: string;
		error?: string;
		required?: boolean;
		children: Snippet;
	};

	let { label = '', id = '', error = '', required = false, children }: Props = $props();
</script>

<div>
	{#if label}
		<label for={id} class="mb-1 block text-sm font-medium text-slate-300 light:text-slate-700">
			{label}
			{#if required}<span class="text-red-400">*</span>{/if}
		</label>
	{/if}
	{@render children()}
	{#if error}
		<p class="mt-1 text-xs text-red-400">{error}</p>
	{/if}
</div>
