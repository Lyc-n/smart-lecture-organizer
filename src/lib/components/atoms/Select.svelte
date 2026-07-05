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
	class="w-full rounded-lg border border-border-hover bg-bg-surface px-3 py-2 text-sm text-text-base transition focus:border-primary focus:outline-none {className}"
>
	{#if placeholder}
		<option value={null}>{placeholder}</option>
	{/if}
	{#each options as opt}
		<option value={opt.value}>{opt.label}</option>
	{/each}
</select>
