<script lang="ts">
	type Props = {
		value?: string;
		colors?: string[];
		onchange?: (color: string) => void;
	};

	let {
		value = $bindable('#6366f1'),
		colors = [
			'#6366f1', '#8b5cf6', '#a855f7', '#d946ef',
			'#ec4899', '#f43f5e', '#ef4444', '#f97316',
			'#eab308', '#22c55e', '#10b981', '#14b8a6',
			'#06b6d4', '#0ea5e9', '#3b82f6', '#64748b'
		],
		onchange
	}: Props = $props();

	function select(c: string) {
		value = c;
		onchange?.(c);
	}
</script>

<div class="flex flex-wrap gap-2">
	{#each colors as c}
		<button
			type="button"
			onclick={() => select(c)}
			class="h-7 w-7 rounded-full border-2 transition"
			style="background-color: {c}"
			class:border-white={value === c}
			class:border-transparent={value !== c}
			aria-label={c}
		></button>
	{/each}
</div>
