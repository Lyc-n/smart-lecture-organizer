<script lang="ts">
	import Icon from '$lib/components/atoms/Icon.svelte';
	import GroupTree from './GroupTree.svelte';

	let {
		groups,
		parentId = null,
		level = 0,
		onSelect
	}: {
		groups: Array<{
			id: string;
			name: string;
			subtitle?: string | null;
			color: string;
			icon: string;
			parentId: string | null;
		}>;
		parentId?: string | null;
		level?: number;
		onSelect?: (id: string) => void;
	} = $props();

	let expanded = $state<Set<string>>(new Set());

	const children = $derived(groups.filter((g) => g.parentId === parentId));

	function toggle(id: string) {
		const next = new Set(expanded);
		if (next.has(id)) {
			next.delete(id);
		} else {
			next.add(id);
		}
		expanded = next;
	}

	function hasChildren(groupId: string) {
		return groups.some((g) => g.parentId === groupId);
	}
</script>

{#if children.length > 0}
	<div class="flex flex-col" class:ml-5={level > 0}>
		{#each children as group (group.id)}
			<div>
				<button
					type="button"
					onclick={() => {
						if (hasChildren(group.id)) {
							toggle(group.id);
						} else {
							onSelect?.(group.id);
						}
					}}
					ondblclick={() => onSelect?.(group.id)}
					class="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition hover:bg-slate-800 light:hover:bg-slate-100"
				>
					{#if hasChildren(group.id)}
						<svg
							class="h-3.5 w-3.5 shrink-0 text-slate-500 light:text-slate-400 transition"
							class:rotate-90={expanded.has(group.id)}
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							viewBox="0 0 24 24"
						>
							<path d="M9 18l6-6-6-6" />
						</svg>
					{:else}
						<span class="w-3.5"></span>
					{/if}
					<div
						class="flex h-6 w-6 shrink-0 items-center justify-center rounded"
						style="background-color: {group.color}20"
					>
						<Icon name={group.icon} size={16} color={group.color} />
					</div>
					<span class="truncate text-slate-200 light:text-slate-700">{group.name}</span>
				</button>

				{#if expanded.has(group.id)}
					<GroupTree {groups} parentId={group.id} level={level + 1} {onSelect} />
				{/if}
			</div>
		{/each}
	</div>
{/if}
