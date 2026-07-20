<script lang="ts">
	import { goto } from '$app/navigation';
	import Icon from '$lib/components/atoms/Icon.svelte';

	let { groups, hasMore, loadingMore, onLoadMore }: {
		groups: Array<Record<string, unknown>>;
		hasMore: boolean;
		loadingMore: boolean;
		onLoadMore: () => void;
	} = $props();
</script>

<section class="mb-6">
	<h2 class="mb-3 text-sm font-semibold text-text-secondary uppercase tracking-wider">Grup ({groups.length})</h2>
	<div class="flex flex-col gap-2">
		{#each groups as group (group.id as string)}
			<button
				type="button"
				onclick={() => goto(`/app/groups/${group.id}`)}
				class="flex items-center gap-3 rounded-xl bg-bg-elevated border border-border-main p-3 text-left transition hover:border-border-hover"
			>
				<div
					class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
					style="background-color: {(group.color as string) ?? '#6366f1'}20"
				>
					<Icon name={(group.icon as string) ?? 'Folder'} color={(group.color as string) ?? '#6366f1'} />
				</div>
				<div class="min-w-0 flex-1">
					<div class="truncate text-sm font-medium text-text-base">{group.name as string}</div>
					{#if group.subtitle}
						<div class="text-xs text-text-muted">{group.subtitle as string}</div>
					{/if}
				</div>
			</button>
		{/each}
	</div>
	{#if hasMore}
		<button
			type="button"
			onclick={onLoadMore}
			disabled={loadingMore}
			class="mt-3 w-full rounded-xl border border-border-main bg-bg-elevated py-2.5 text-sm font-medium text-text-secondary transition hover:border-border-hover disabled:opacity-50"
		>
			{loadingMore ? 'Memuat...' : 'Muat lebih banyak grup'}
		</button>
	{/if}
</section>
