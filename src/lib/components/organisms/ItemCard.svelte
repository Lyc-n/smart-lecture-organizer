<script lang="ts">
	import { api } from '$lib/utils/api';
	import { downloadForOffline } from '$lib/stores/offline';
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
		onclick
	}: {
		item: Item;
		onclick?: () => void;
	} = $props();

	const typeIcons: Record<string, string> = {
		image: 'image',
		video: 'video',
		audio: 'music',
		document: 'file-text',
		note: 'file-text'
	};

	let pinned = $state(item.isPinned);
	let downloadLoading = $state(false);

	async function togglePin(e: MouseEvent) {
		e.stopPropagation();
		try {
			const result = await api.post<{ isPinned: boolean }>(`/api/items/${item.id}/pin`);
			pinned = result.isPinned;
		} catch (e) {
			console.error('Failed to toggle pin:', e);
		}
	}

	async function handleDownload(e: MouseEvent) {
		e.stopPropagation();
		if (!item.fileUrl) return;
		downloadLoading = true;
		try {
			await downloadForOffline(item.fileUrl);
		} catch (e) {
			console.error('Failed to download:', e);
		} finally {
			downloadLoading = false;
		}
	}
</script>

<div
	class="flex w-full cursor-pointer items-center gap-3 rounded-xl bg-bg-elevated border border-border-main p-3 text-left transition hover:border-border-hover hover:bg-bg-hover/80"
	onclick={onclick}
	onkeydown={(e) => e.key === 'Enter' && onclick?.()}
	role="button"
	tabindex="0"
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

	{#if item.fileUrl}
		<button
			type="button"
			onclick={handleDownload}
			disabled={downloadLoading}
			class="shrink-0 rounded-md p-1.5 text-text-muted transition hover:text-primary disabled:opacity-50"
			aria-label="Simpan offline"
		>
			{#if downloadLoading}
				<svg class="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
					<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
					<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
				</svg>
			{:else}
				<Icon name="download" size={16} />
			{/if}
		</button>
	{/if}

	<button
		type="button"
		onclick={togglePin}
		class="shrink-0 rounded-md p-1.5 text-text-muted transition hover:text-tertiary"
		aria-label={pinned ? 'Unpin' : 'Pin'}
	>
		<Icon name="pin" size={16} class={pinned ? 'text-yellow-400' : ''} />
	</button>
</div>
