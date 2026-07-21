<script lang="ts">
	import { page } from '$app/stores';
	import { invalidate } from '$app/navigation';
	import Icon from '$lib/components/atoms/Icon.svelte';
	import ItemMediaPreview from '$lib/components/molecules/ItemMediaPreview.svelte';
	import { formatSize, formatDateTime } from '$lib/utils/format';

	const item = $derived($page.data.item);
	const groups = $derived($page.data.groups ?? []);
	const note = $derived($page.data.note);
	const loaded = $derived($page.data.item !== undefined);

	let ocrLoading = $state(false);
	let ocrError = $state('');
	let ocrResult = $state<string | null>(null);

	$effect(() => {
		if (item?.id) {
			fetch('/api/recent-access', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ item_id: item.id })
			});
		}
	});

	const typeLabels: Record<string, string> = {
		image: 'Gambar',
		video: 'Video',
		audio: 'Audio',
		document: 'Dokumen',
		note: 'Catatan'
	};

	async function runOcr(title?: string) {
		ocrLoading = true;
		ocrError = '';
		ocrResult = null;

		try {
			const res = await fetch('/api/ocr', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ itemId: item.id, title: title || undefined })
			});

			if (!res.ok) {
				const data = await res.json().catch(() => ({}));
				throw new Error(data.message || 'OCR gagal');
			}

			const data = await res.json();
			ocrResult = data.content;
			invalidate(`/app/items/${item.id}`);
		} catch (e) {
			ocrError = e instanceof Error ? e.message : 'OCR gagal';
		} finally {
			ocrLoading = false;
		}
	}
</script>

<svelte:head>
	<title>{item?.name ?? 'Item'} — SmartLO</title>
</svelte:head>

{#if !loaded}
	<div class="min-h-screen bg-bg-surface text-text-base p-8">
		<div class="mx-auto max-w-4xl">
			<div class="flex flex-col gap-4">
				<div class="h-6 w-24 animate-pulse rounded bg-bg-hover"></div>
				<div class="h-48 animate-pulse rounded-xl bg-bg-elevated"></div>
				<div class="h-32 animate-pulse rounded-xl bg-bg-elevated"></div>
			</div>
		</div>
	</div>
{:else if !item}
	<div class="min-h-screen bg-bg-surface text-text-base p-8">
		<div class="mx-auto max-w-4xl text-center text-text-muted">
			<p>Item tidak ditemukan.</p>
		</div>
	</div>
{:else}
	<div class="min-h-screen bg-bg-surface text-text-base p-8">
		<div class="mx-auto max-w-4xl">
			<a
				href="/app/groups"
				class="mb-4 flex items-center gap-1 text-sm text-text-muted transition hover:text-text-secondary"
			>
				<svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
				</svg>
				Kembali
			</a>

			<div class="rounded-xl bg-bg-elevated border border-border-main overflow-hidden">
				<div class="p-6 pb-4">
					<div class="mb-2 flex items-start justify-between">
						<div>
							<h1 class="text-xl font-bold">{item.name}</h1>
							<p class="mt-1 text-sm text-text-muted">{typeLabels[item.type] ?? item.type}</p>
						</div>
					</div>

					<div class="mt-4 flex flex-wrap gap-4 text-xs text-text-muted">
						<span>Ukuran: {formatSize(item.fileSize)}</span>
						<span>Diupload: {formatDateTime(item.createdAt)}</span>
						{#if item.updatedAt && String(item.updatedAt) !== String(item.createdAt)}
							<span>Diubah: {formatDateTime(item.updatedAt)}</span>
						{/if}
					</div>
				</div>

				<ItemMediaPreview {item} {note} {ocrLoading} {ocrError} {ocrResult} onRunOcr={runOcr} />
			</div>

			{#if ocrResult || note}
				<div class="mt-6 rounded-xl bg-bg-elevated border border-border-main p-6">
					<h2 class="mb-3 text-sm font-semibold text-text-secondary uppercase tracking-wider">Hasil OCR</h2>
					{#if note?.title}
						<h3 class="mb-2 text-base font-medium text-text-secondary">{note.title}</h3>
					{/if}
					<p class="whitespace-pre-wrap text-sm text-text-secondary">{ocrResult ?? note?.content}</p>
				</div>
			{/if}

			{#if groups.length > 0}
				<div class="mt-6 rounded-xl bg-bg-elevated border border-border-main p-6">
					<h2 class="mb-3 text-sm font-semibold text-text-secondary uppercase tracking-wider">Grup</h2>
					<div class="flex flex-wrap gap-2">
						{#each groups as group}
							<a
								href="/app/groups/{group.id}"
								class="flex items-center gap-2 rounded-lg border border-border-hover bg-bg-surface px-3 py-2 text-sm text-text-secondary transition hover:border-text-muted hover:text-text-secondary"
							>
								<div class="h-3 w-3 rounded-full" style="background-color: {group.color}"></div>
								<Icon name={group.icon} size={14} />
								<span>{group.name}</span>
							</a>
						{/each}
					</div>
				</div>
			{/if}
		</div>
	</div>
{/if}
