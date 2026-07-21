<script lang="ts">
	import { api } from '$lib/utils/api';
	import Icon from '$lib/components/atoms/Icon.svelte';
	import { formatSize, formatDate } from '$lib/utils/format';

	type Item = {
		id: string;
		name: string;
		type: string;
		mimeType: string | null;
		fileSize: number | null;
		fileUrl: string | null;
		isPinned: boolean;
		createdAt: Date | string;
	};

	let {
		item,
		href = ''
	}: {
		item: Item;
		href?: string;
	} = $props();

	const typeIcons: Record<string, string> = {
		image: 'image',
		video: 'video',
		audio: 'music',
		document: 'file-text',
		note: 'file-text'
	};

	let pinned = $state(false);

	$effect(() => { pinned = item.isPinned; });

	async function togglePin(e: MouseEvent) {
		e.preventDefault();
		e.stopPropagation();
		try {
			const result = await api.post<{ isPinned: boolean }>(`/api/items/${item.id}/pin`);
			pinned = result.isPinned;
		} catch (e) {
			console.error('Failed to toggle pin:', e);
		}
	}
</script>

<a
	{href}
	class="flex w-full items-center gap-3 rounded-xl bg-bg-elevated border border-border-main p-3 text-left transition hover:border-border-hover hover:bg-bg-hover/80"
>
	<div
		class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-bg-hover text-text-muted"
	>
		{#if item.type === 'image' && item.fileUrl}
			<img src={item.fileUrl} alt={item.name} class="h-9 w-9 rounded-lg object-cover" />
		{:else}
			<Icon name={typeIcons[item.type] ?? 'file-text'} size={20} />
		{/if}
	</div>

	<div class="min-w-0 flex-1">
		<div class="truncate text-sm font-medium text-text-base">{item.name}</div>
		<div class="truncate text-xs text-text-muted">
			{formatSize(item.fileSize)} &middot; {formatDate(item.createdAt)}
		</div>
	</div>

	<button
		type="button"
		onclick={togglePin}
		class="shrink-0 rounded-md p-1.5 text-text-muted transition hover:text-tertiary"
		aria-label={pinned ? 'Unpin' : 'Pin'}
	>
		<Icon name="pin" size={16} class={pinned ? 'text-yellow-400' : ''} />
	</button>
</a>
