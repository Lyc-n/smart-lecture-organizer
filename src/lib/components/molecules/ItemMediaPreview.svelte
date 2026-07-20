<script lang="ts">
	type MediaItem = {
		id: string;
		name: string;
		type: string;
		fileUrl?: string | null;
		mimeType?: string | null;
	};

	let { item, note, ocrLoading, ocrError, ocrResult, onRunOcr }: {
		item: MediaItem;
		note: { id: string; title?: string; content: string } | null;
		ocrLoading: boolean;
		ocrError: string;
		ocrResult: string | null;
		onRunOcr: (title: string) => void;
	} = $props();

	let lightboxOpen = $state(false);
	let ocrTitle = $state('');
</script>

<div class="border-t border-border-main">
	{#if item.type === 'image' && item.fileUrl}
		<div class="flex items-center justify-center bg-black/50 p-4">
			<button
				type="button"
				onclick={() => (lightboxOpen = true)}
				class="max-h-[60vh] max-w-full overflow-hidden rounded-lg transition hover:opacity-90"
			>
				<img src={item.fileUrl} alt={item.name} class="max-h-[60vh] max-w-full object-contain" />
			</button>
		</div>

		{#if lightboxOpen}
			<div
				class="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
				onclick={() => (lightboxOpen = false)}
				onkeydown={(e) => e.key === 'Escape' && (lightboxOpen = false)}
				role="dialog"
				tabindex="-1"
			>
				<img src={item.fileUrl} alt={item.name} class="max-h-[90vh] max-w-[90vw] object-contain" />
			</div>
		{/if}

		<div class="border-t border-border-main p-4">
			{#if ocrLoading}
				<div class="flex items-center gap-3 text-sm text-text-secondary">
					<svg class="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
						<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
						<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
					</svg>
					Memproses OCR...
				</div>
			{:else if note || ocrResult}
				<button
					type="button"
					onclick={() => onRunOcr(ocrTitle)}
					class="text-sm text-primary transition hover:text-primary"
				>
					OCR Ulang
				</button>
			{:else}
				<div class="flex flex-col gap-3 sm:flex-row sm:items-end">
					<div class="flex-1">
						<label for="ocr-title" class="mb-1 block text-xs text-text-muted">Judul (opsional)</label>
						<input
							id="ocr-title"
							type="text"
							bind:value={ocrTitle}
							placeholder="Mis: Catatan Kuliah 1"
							class="w-full rounded-lg border border-border-hover bg-bg-surface px-3 py-2 text-sm text-text-base placeholder-text-muted transition focus:border-primary focus:outline-none"
						/>
					</div>
					<button
						type="button"
						onclick={() => onRunOcr(ocrTitle)}
						class="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-primary-hover"
					>
						<svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
						</svg>
						Proses OCR
					</button>
				</div>
			{/if}

			{#if ocrError}
				<p class="mt-2 text-sm text-danger">{ocrError}</p>
			{/if}
		</div>
	{:else if item.type === 'video' && item.fileUrl}
		<div class="flex items-center justify-center bg-black/50 p-4">
			<video controls class="max-h-[60vh] max-w-full rounded-lg">
				<source src={item.fileUrl} type={item.mimeType ?? undefined} />
			</video>
		</div>
	{:else if item.type === 'audio' && item.fileUrl}
		<div class="flex items-center justify-center bg-black/30 p-8">
			<audio controls class="w-full max-w-md">
				<source src={item.fileUrl} type={item.mimeType ?? undefined} />
			</audio>
		</div>
	{:else if item.type === 'document' && item.fileUrl}
		<div class="p-8 text-center">
			<div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-bg-hover">
				<svg class="h-8 w-8 text-text-muted" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
				</svg>
			</div>
			<p class="mb-4 text-sm text-text-muted">{item.mimeType ?? 'Dokumen'}</p>
		</div>
	{:else if item.type === 'note'}
		<div class="p-8">
			<p class="text-sm text-text-secondary">Tipe catatan belum didukung.</p>
		</div>
	{:else}
		<div class="p-8 text-center">
			<p class="text-sm text-text-muted">Berkas tidak tersedia.</p>
		</div>
	{/if}
</div>
