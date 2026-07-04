<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { invalidate } from '$app/navigation';
	import Icon from '$lib/components/atoms/Icon.svelte';
	import { downloadForOffline } from '$lib/stores/offline';

	const item = $derived($page.data.item);
	const groups = $derived($page.data.groups ?? []);
	const note = $derived($page.data.note);

	let lightboxOpen = $state(false);
	let ocrLoading = $state(false);
	let ocrError = $state('');
	let ocrTitle = $state('');
	let ocrResult = $state<string | null>(null);
	let downloadLoading = $state(false);
	let downloadDone = $state(false);

	$effect(() => {
		if (item?.id) {
			fetch('/api/recent-access', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ item_id: item.id })
			});
		}
	});

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
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	}

	const typeLabels: Record<string, string> = {
		image: 'Gambar',
		video: 'Video',
		audio: 'Audio',
		document: 'Dokumen',
		note: 'Catatan'
	};

	async function handleDownload() {
		if (!item.fileUrl) return;
		downloadLoading = true;
		downloadDone = false;
		try {
			await downloadForOffline(item.fileUrl);
			downloadDone = true;
		} catch {
			downloadDone = false;
		} finally {
			downloadLoading = false;
		}
	}

	async function runOcr() {
		ocrLoading = true;
		ocrError = '';
		ocrResult = null;

		try {
			const res = await fetch('/api/ocr', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ itemId: item.id, title: ocrTitle || undefined })
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
	<title>{item.name} — Smart Lecture Organizer</title>
</svelte:head>

<div class="min-h-screen bg-slate-950 light:bg-slate-50 text-slate-100 light:text-slate-900 p-8">
	<div class="mx-auto max-w-4xl">
		<button
			type="button"
			onclick={() => goto('/app/groups')}
			class="mb-4 flex items-center gap-1 text-sm text-slate-500 light:text-slate-400 transition hover:text-slate-300 light:hover:text-slate-600"
		>
			<svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
			</svg>
			Kembali
		</button>

		<div class="rounded-xl bg-slate-900 light:bg-white border border-slate-800 light:border-slate-200 overflow-hidden">
			<div class="p-6 pb-4">
				<div class="mb-2 flex items-start justify-between">
					<div>
						<h1 class="text-xl font-bold">{item.name}</h1>
						<p class="mt-1 text-sm text-slate-500 light:text-slate-400">{typeLabels[item.type] ?? item.type}</p>
					</div>
				</div>

				<div class="mt-4 flex flex-wrap gap-4 text-xs text-slate-500 light:text-slate-400">
					<span>Ukuran: {formatSize(item.fileSize)}</span>
					<span>Diupload: {formatDate(item.createdAt)}</span>
					{#if item.updatedAt && String(item.updatedAt) !== String(item.createdAt)}
						<span>Diubah: {formatDate(item.updatedAt)}</span>
					{/if}
				</div>
			</div>

			<div class="border-t border-slate-800 light:border-slate-200">
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

					<div class="border-t border-slate-800 light:border-slate-200 p-4">
						{#if ocrLoading}
							<div class="flex items-center gap-3 text-sm text-slate-400 light:text-slate-500">
								<svg class="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
									<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
									<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
								</svg>
								Memproses OCR...
							</div>
						{:else if note || ocrResult}
							<button
								type="button"
								onclick={runOcr}
								class="text-sm text-indigo-400 light:text-indigo-600 transition hover:text-indigo-300 light:hover:text-indigo-500"
							>
								OCR Ulang
							</button>
						{:else}
							<div class="flex flex-col gap-3 sm:flex-row sm:items-end">
								<div class="flex-1">
									<label for="ocr-title" class="mb-1 block text-xs text-slate-500 light:text-slate-400">Judul (opsional)</label>
									<input
										id="ocr-title"
										type="text"
										bind:value={ocrTitle}
										placeholder="Mis: Catatan Kuliah 1"
										class="w-full rounded-lg border border-slate-700 light:border-slate-300 bg-slate-950 light:bg-slate-100 px-3 py-2 text-sm text-slate-100 light:text-slate-900 placeholder-slate-500 light:placeholder-slate-400 transition focus:border-indigo-500 focus:outline-none"
									/>
								</div>
								<button
									type="button"
									onclick={runOcr}
									class="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-500"
								>
									<svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
									</svg>
									Proses OCR
								</button>
							</div>
						{/if}

						{#if ocrError}
							<p class="mt-2 text-sm text-red-400 light:text-red-500">{ocrError}</p>
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
						<div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-800 light:bg-slate-100">
							<svg class="h-8 w-8 text-slate-500 light:text-slate-400" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
							</svg>
						</div>
						<p class="mb-4 text-sm text-slate-500 light:text-slate-400">{item.mimeType ?? 'Dokumen'}</p>
					</div>
				{:else if item.type === 'note'}
					<div class="p-8">
						<p class="text-sm text-slate-400 light:text-slate-500">Tipe catatan belum didukung.</p>
					</div>
				{:else}
					<div class="p-8 text-center">
						<p class="text-sm text-slate-500 light:text-slate-400">Berkas tidak tersedia.</p>
					</div>
				{/if}

				{#if item.fileUrl}
					<div class="border-t border-slate-800 light:border-slate-200 p-4">
						<button
							type="button"
							onclick={handleDownload}
							disabled={downloadLoading}
							class="flex items-center gap-2 rounded-lg border border-slate-700 light:border-slate-300 px-4 py-2 text-sm text-slate-300 light:text-slate-700 transition hover:border-slate-600 light:hover:border-slate-400 hover:text-slate-100 light:hover:text-slate-900 disabled:opacity-50"
						>
							{#if downloadLoading}
								<svg class="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
									<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
									<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
								</svg>
								Menyimpan...
							{:else if downloadDone}
								<svg class="h-4 w-4 text-green-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
								</svg>
								Tersimpan
							{:else}
								<svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
								</svg>
								Simpan Offline
							{/if}
						</button>
					</div>
				{/if}
			</div>
		</div>

		{#if ocrResult || note}
			<div class="mt-6 rounded-xl bg-slate-900 light:bg-white border border-slate-800 light:border-slate-200 p-6">
				<h2 class="mb-3 text-sm font-semibold text-slate-400 light:text-slate-500 uppercase tracking-wider">Hasil OCR</h2>
				{#if note?.title}
					<h3 class="mb-2 text-base font-medium text-slate-200 light:text-slate-700">{note.title}</h3>
				{/if}
				<p class="whitespace-pre-wrap text-sm text-slate-300 light:text-slate-600">{ocrResult ?? note?.content}</p>
			</div>
		{/if}

		{#if groups.length > 0}
			<div class="mt-6 rounded-xl bg-slate-900 light:bg-white border border-slate-800 light:border-slate-200 p-6">
				<h2 class="mb-3 text-sm font-semibold text-slate-400 light:text-slate-500 uppercase tracking-wider">Grup</h2>
				<div class="flex flex-wrap gap-2">
					{#each groups as group}
						<button
							type="button"
							onclick={() => goto(`/app/groups/${group.id}`)}
							class="flex items-center gap-2 rounded-lg border border-slate-700 light:border-slate-300 bg-slate-950 light:bg-slate-100 px-3 py-2 text-sm text-slate-400 light:text-slate-500 transition hover:border-slate-600 light:hover:border-slate-400 hover:text-slate-200 light:hover:text-slate-700"
						>
							<div class="h-3 w-3 rounded-full" style="background-color: {group.color}"></div>
							<Icon name={group.icon} size={14} />
							<span>{group.name}</span>
						</button>
					{/each}
				</div>
			</div>
		{/if}
	</div>
</div>
