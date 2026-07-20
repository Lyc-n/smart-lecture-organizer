<script lang="ts">
	import Icon from '$lib/components/atoms/Icon.svelte';
	import { VALID_ICONS } from '$lib/constants';

	type Props = {
		value?: string;
		icons?: readonly string[];
		onchange?: (icon: string) => void;
	};

	let {
		value = $bindable('folder'),
		icons = VALID_ICONS,
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
			class="flex items-center justify-center rounded-lg border p-2 transition {value === ic ? 'border-primary' : 'border-border-hover'}"
			style={value === ic ? 'background-color: rgb(99 102 241 / 0.1)' : ''}
			aria-label={ic}
		>
			<Icon name={ic} size={16} color={value === ic ? '#6366f1' : '#94a3b8'} />
		</button>
	{/each}
</div>
