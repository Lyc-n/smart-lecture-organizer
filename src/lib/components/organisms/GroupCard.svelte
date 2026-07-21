<script lang="ts">
	import Icon from '$lib/components/atoms/Icon.svelte';
	import Badge from '$lib/components/atoms/Badge.svelte';

	let {
		group,
		href = ''
	}: {
		group: {
			id: string;
			name: string;
			subtitle?: string | null;
			color: string;
			icon: string;
			itemCount?: number;
		};
		href?: string;
	} = $props();
</script>

<a
	{href}
	class="flex w-full items-center gap-3 rounded-xl bg-bg-elevated border border-border-main p-3 text-left transition hover:border-border-hover hover:bg-bg-hover/80"
	style="border-left: 3px solid {group.color}"
>
	<div
		class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
		style="background-color: {group.color}20"
	>
		<Icon name={group.icon} size={20} color={group.color} />
	</div>
	<div class="min-w-0 flex-1">
		<div class="truncate text-sm font-medium text-text-base">{group.name}</div>
		{#if group.subtitle}
			<div class="truncate text-xs text-text-muted">{group.subtitle}</div>
		{/if}
	</div>
	{#if group.itemCount !== undefined}
		<Badge>{group.itemCount}</Badge>
	{/if}
</a>
