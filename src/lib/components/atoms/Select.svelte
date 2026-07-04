<script lang="ts">
	type Option = { value: string | number | null; label: string };

	type Props = {
		value?: string | number | null;
		options: Option[];
		id?: string;
		placeholder?: string;
		disabled?: boolean;
		class?: string;
	};

	let {
		value = $bindable(null),
		options,
		id = '',
		placeholder = '',
		disabled = false,
		class: className = ''
	}: Props = $props();
</script>

<select
	{id}
	{disabled}
	bind:value
	class="w-full rounded-lg border border-slate-700 light:border-slate-300 bg-slate-950 light:bg-slate-100 px-3 py-2 text-sm text-slate-100 light:text-slate-900 transition focus:border-indigo-500 focus:outline-none {className}"
>
	{#if placeholder}
		<option value={null}>{placeholder}</option>
	{/if}
	{#each options as opt}
		<option value={opt.value}>{opt.label}</option>
	{/each}
</select>
