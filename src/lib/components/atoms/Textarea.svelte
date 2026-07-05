<script lang="ts">
	type Props = {
		value?: string;
		placeholder?: string;
		id?: string;
		rows?: number;
		disabled?: boolean;
		class?: string;
	};

	let {
		value = $bindable(''),
		placeholder = '',
		id = '',
		rows = 2,
		disabled = false,
		class: className = ''
	}: Props = $props();
</script>

<textarea
	{id}
	{placeholder}
	{rows}
	{disabled}
	bind:value
	class="w-full rounded-lg border border-border-hover bg-bg-surface px-3 py-2 text-sm text-text-base placeholder-text-muted transition focus:border-primary focus:outline-none {className}"
></textarea>
