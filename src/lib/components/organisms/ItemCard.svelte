<script lang="ts">
	import { api } from '$lib/utils/api';
	import { downloadForOffline } from '$lib/stores/offline';
	import ImageIcon from 'phosphor-svelte/lib/ImageIcon';
	import VideoIcon from 'phosphor-svelte/lib/VideoIcon';
	import MusicNotesIcon from 'phosphor-svelte/lib/MusicNotesIcon';
	import FileTextIcon from 'phosphor-svelte/lib/FileTextIcon';
	import PushPinIcon from 'phosphor-svelte/lib/PushPinIcon';
	import DownloadIcon from 'phosphor-svelte/lib/DownloadIcon';

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

	function formatSize(bytes: number | null): string {
		if (!bytes) return '-';
		if (bytes < 1024) return `${bytes} B`;
		if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
		return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
	}

	function formatDate(date: string | Date): string {
		return new Date(date).toLocaleDateString('id-ID', {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		});
	}
</script>

<div
	class="flex w-full cursor-pointer items-center gap-3 rounded-xl bg-slate-900 light:bg-white border border-slate-800 light:border-slate-200 p-3 text-left transition hover:border-slate-700 light:hover:border-slate-300 hover:bg-slate-800/80 light:hover:bg-slate-100/80"
	onclick={onclick}
	onkeydown={(e) => e.key === 'Enter' && onclick?.()}
	role="button"
	tabindex="0"
>
	<div
		class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-800 light:bg-slate-100 text-slate-500 light:text-slate-400"
	>
		{#if item.type === 'image'}
			{#if item.fileUrl}
				<img src={item.fileUrl} alt={item.name} class="h-9 w-9 rounded-lg object-cover" />
			{:else}
				<ImageIcon size={20} />
			{/if}
		{:else if item.type === 'video'}
			<VideoIcon size={20} />
		{:else if item.type === 'audio'}
			<MusicNotesIcon size={20} />
		{:else}
			<FileTextIcon size={20} />
		{/if}
	</div>

	<div class="min-w-0 flex-1">
		<div class="truncate text-sm font-medium text-slate-100 light:text-slate-900">{item.name}</div>
		<div class="truncate text-xs text-slate-500 light:text-slate-400">
			{formatSize(item.fileSize)} &middot; {formatDate(item.createdAt)}
		</div>
	</div>

	{#if item.fileUrl}
		<button
			type="button"
			onclick={handleDownload}
			disabled={downloadLoading}
			class="shrink-0 rounded-md p-1.5 text-slate-600 light:text-slate-400 transition hover:text-indigo-400 light:hover:text-indigo-600 disabled:opacity-50"
			aria-label="Simpan offline"
		>
			{#if downloadLoading}
				<svg class="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
					<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
					<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
				</svg>
			{:else}
				<DownloadIcon size={16} />
			{/if}
		</button>
	{/if}

	<button
		type="button"
		onclick={togglePin}
		class="shrink-0 rounded-md p-1.5 text-slate-600 light:text-slate-400 transition hover:text-yellow-400 light:hover:text-yellow-600"
		aria-label={pinned ? 'Unpin' : 'Pin'}
	>
		{#if pinned}
			<PushPinIcon size={16} weight="fill" class="text-yellow-400" />
		{:else}
			<PushPinIcon size={16} />
		{/if}
	</button>
</div>
