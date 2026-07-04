<script lang="ts">
	import Icon from '$lib/components/atoms/Icon.svelte';
	import Badge from '$lib/components/atoms/Badge.svelte';

	let {
		group,
		onclick
	}: {
		group: {
			id: string;
			name: string;
			subtitle?: string | null;
			color: string;
			icon: string;
			itemCount?: number;
		};
		onclick?: () => void;
	} = $props();
</script>

<button
	type="button"
	onclick={onclick}
	class="flex w-full items-center gap-3 rounded-xl bg-slate-900 light:bg-white border border-slate-800 light:border-slate-200 p-3 text-left transition hover:border-slate-700 light:hover:border-slate-300 hover:bg-slate-800/80 light:hover:bg-slate-100/80"
	style="border-left: 3px solid {group.color}"
>
	<div
		class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
		style="background-color: {group.color}20"
	>
		<Icon name={group.icon} size={20} color={group.color} />
	</div>
	<div class="min-w-0 flex-1">
		<div class="truncate text-sm font-medium text-slate-100 light:text-slate-900">{group.name}</div>
		{#if group.subtitle}
			<div class="truncate text-xs text-slate-500 light:text-slate-400">{group.subtitle}</div>
		{/if}
	</div>
	{#if group.itemCount !== undefined}
		<Badge>{group.itemCount}</Badge>
	{/if}
</button>
