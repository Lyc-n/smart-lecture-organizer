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
		<label for={id} class="mb-1 block text-sm font-medium text-text-secondary">
			{label}
			{#if required}<span class="text-danger">*</span>{/if}
		</label>
	{/if}
	{@render children()}
	{#if error}
		<p class="mt-1 text-xs text-danger">{error}</p>
	{/if}
</div>
