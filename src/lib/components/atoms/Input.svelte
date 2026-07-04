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
	class="w-full rounded-lg border bg-slate-950 light:bg-slate-100 px-3 py-2 text-sm text-slate-100 light:text-slate-900 placeholder-slate-600 light:placeholder-slate-400 transition focus:border-indigo-500 focus:outline-none {error ? 'border-red-500' : 'border-slate-700 light:border-slate-300'} {className}"
/>
{#if error}
	<p class="mt-1 text-xs text-red-400">{error}</p>
{/if}
