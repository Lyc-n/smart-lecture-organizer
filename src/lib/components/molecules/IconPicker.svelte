<script lang="ts">
	import Icon from '$lib/components/atoms/Icon.svelte';

	type Props = {
		value?: string;
		icons?: string[];
		onchange?: (icon: string) => void;
	};

	let {
		value = $bindable('folder'),
		icons = [
			'folder', 'book', 'graduation-cap', 'calculator',
			'flask', 'globe', 'music', 'image',
			'file-text', 'video', 'code', 'pen-tool',
			'bar-chart', 'heart', 'star', 'archive',
			'briefcase', 'compass', 'cpu', 'database'
		],
		onchange
	}: Props = $props();

	function select(ic: string) {
		value = ic;
		onchange?.(ic);
	}
</script>

<div class="grid grid-cols-10 gap-1.5">
	{#each icons as ic}
		<button
			type="button"
			onclick={() => select(ic)}
			class="flex items-center justify-center rounded-lg border p-2 transition {value === ic ? 'border-indigo-500' : 'border-slate-700 light:border-slate-300'}"
			style={value === ic ? 'background-color: rgb(99 102 241 / 0.1)' : ''}
			aria-label={ic}
		>
			<Icon name={ic} size={16} color={value === ic ? '#6366f1' : '#94a3b8'} />
		</button>
	{/each}
</div>
