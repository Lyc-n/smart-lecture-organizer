<script lang="ts">
	type Props = {
		value?: string;
		placeholder?: string;
		error?: string;
		id?: string;
		required?: boolean;
		disabled?: boolean;
		type?: 'text' | 'email' | 'password' | 'number' | 'search' | 'url' | 'tel' | 'date' | 'datetime-local';
		oninput?: (e: Event) => void;
		class?: string;
	};

	let {
		value = $bindable(''),
		placeholder = '',
		error = '',
		id = '',
		required = false,
		disabled = false,
		type = 'text',
		oninput,
		class: className = ''
	}: Props = $props();
</script>

<input
	{type}
	{id}
	{placeholder}
	{required}
	{disabled}
	bind:value
	{oninput}
	class="w-full rounded-lg border bg-bg-surface px-3 py-2 text-sm text-text-base placeholder-text-muted transition focus:border-primary focus:outline-none {error ? 'border-danger' : 'border-border-hover'} {className}"
/>
{#if error}
	<p class="mt-1 text-xs text-danger">{error}</p>
{/if}
