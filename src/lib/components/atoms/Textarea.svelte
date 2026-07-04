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
	class="w-full rounded-lg border border-slate-700 light:border-slate-300 bg-slate-950 light:bg-slate-100 px-3 py-2 text-sm text-slate-100 light:text-slate-900 placeholder-slate-600 light:placeholder-slate-400 transition focus:border-indigo-500 focus:outline-none {className}"
></textarea>
