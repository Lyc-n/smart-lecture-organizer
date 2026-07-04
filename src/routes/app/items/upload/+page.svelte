<script lang="ts">
	import { page } from '$app/stores';
	import { invalidate } from '$app/navigation';
	import { generateSvelteHelpers } from '@uploadthing/svelte';
	import type { OurFileRouter } from '$lib/server/uploadthing';
	import { api } from '$lib/utils/api';
	import Icon from '$lib/components/atoms/Icon.svelte';

	const { createUploadThing } = generateSvelteHelpers<OurFileRouter>();

	const groups = $derived($page.data.groups ?? []);

	let files = $state<File[]>([]);
	let selectedGroupIds = $state<string[]>([]);
	let uploadResult = $state<{ success: boolean; message: string } | null>(null);
	let isSubmitting = $state(false);

	const { startUpload, isUploading } = createUploadThing('fileUploader', {
		onClientUploadComplete: (res) => {
			uploadResult = { success: true, message: `Berhasil mengunggah ${res.length} berkas` };
		},
		onUploadError: (err) => {
			uploadResult = { success: false, message: err.message };
		}
	});

	function handleFileChange(e: Event) {
		const input = e.target as HTMLInputElement;
		if (input.files) {
			files = Array.from(input.files);
		}
	}

	function toggleGroup(id: string) {
		selectedGroupIds = selectedGroupIds.includes(id)
			? selectedGroupIds.filter((g) => g !== id)
			: [...selectedGroupIds, id];
	}

	async function handleUpload() {
		if (files.length === 0) return;

		isSubmitting = true;
		uploadResult = null;

		try {
			const result = await startUpload(files);
			if (result && result.length > 0) {
				for (const file of result) {
					const itemId = (file.serverData as { itemId: string }).itemId;
					if (selectedGroupIds.length > 0 && itemId) {
						await api.post(`/api/items/${itemId}/groups`, { groupIds: selectedGroupIds });
					}
				}
			}
			files = [];
			selectedGroupIds = [];
			invalidate(() => true);
		} catch (e) {
			uploadResult = { success: false, message: (e as Error).message };
		} finally {
			isSubmitting = false;
		}
	}

	function formatSize(bytes: number): string {
		if (bytes < 1024) return `${bytes} B`;
		if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
		return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
	}
</script>

<svelte:head>
	<title>Unggah Berkas — Smart Lecture Organizer</title>
</svelte:head>

<div class="min-h-screen bg-slate-950 light:bg-slate-50 text-slate-100 light:text-slate-900 p-8">
	<div class="mx-auto max-w-2xl">
		<h1 class="mb-6 text-2xl font-bold">Unggah Berkas</h1>

		{#if uploadResult}
			<div
				class="mb-4 rounded-lg p-4 text-sm {uploadResult.success
  ? 'bg-emerald-900/50 light:bg-emerald-100/50 text-emerald-300 light:text-emerald-700 border border-emerald-800 light:border-emerald-300'
  : 'bg-red-900/50 light:bg-red-100/50 text-red-300 light:text-red-700 border border-red-800 light:border-red-300'}"
			>
				{uploadResult.message}
			</div>
		{/if}

		<div class="rounded-xl bg-slate-900 light:bg-white border border-slate-800 light:border-slate-200 p-6">
			<div class="mb-6">
				<label class="mb-2 block text-sm font-medium text-slate-400 light:text-slate-500">Pilih Berkas</label>
				<div
					class="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-700 light:border-slate-300 bg-slate-950/50 light:bg-slate-100/50 p-8 transition hover:border-indigo-500/50"
					onclick={() => document.getElementById('file-input')?.click()}
					onkeydown={(e) => e.key === 'Enter' && document.getElementById('file-input')?.click()}
					role="button"
					tabindex="0"
				>
					<svg class="mb-3 h-10 w-10 text-slate-600 light:text-slate-400" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.348-1.1 3.75 3.75 0 014.157 4.157A4.5 4.5 0 0117.25 19.5H6.75z" />
					</svg>
					<p class="text-sm text-slate-500 light:text-slate-400">Klik untuk memilih berkas atau seret ke sini</p>
					<p class="mt-1 text-xs text-slate-600 light:text-slate-400">Maks 8 MB per berkas</p>
				</div>
				<input
					id="file-input"
					type="file"
					multiple
					class="hidden"
					onchange={handleFileChange}
				/>
			</div>

			{#if files.length > 0}
				<div class="mb-6">
					<h3 class="mb-2 text-sm font-medium text-slate-400 light:text-slate-500">Berkas Dipilih ({files.length})</h3>
					<ul class="space-y-2">
						{#each files as file}
							<li class="flex items-center justify-between rounded-lg bg-slate-950 light:bg-slate-100 px-4 py-2 text-sm">
								<span class="truncate text-slate-300 light:text-slate-700">{file.name}</span>
								<span class="ml-2 shrink-0 text-slate-500 light:text-slate-400">{formatSize(file.size)}</span>
							</li>
						{/each}
					</ul>
				</div>
			{/if}

			{#if groups.length > 0}
				<div class="mb-6">
					<label class="mb-2 block text-sm font-medium text-slate-400 light:text-slate-500">
						Masukkan ke Grup <span class="text-slate-600 light:text-slate-400">(opsional)</span>
					</label>
					<div class="flex flex-wrap gap-2">
						{#each groups as group}
							<button
								type="button"
								onclick={() => toggleGroup(group.id)}
								class="flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition {selectedGroupIds.includes(group.id)
  ? 'border-indigo-500 bg-indigo-500/10 text-indigo-300 light:text-indigo-700'
  : 'border-slate-700 light:border-slate-300 bg-slate-950 light:bg-slate-100 text-slate-400 light:text-slate-500 hover:border-slate-600 light:hover:border-slate-400'}"
							>
								<div class="h-3 w-3 rounded-full" style="background-color: {group.color}"></div>
								<Icon name={group.icon} size={16} />
								<span>{group.name}</span>
							</button>
						{/each}
					</div>
				</div>
			{/if}

			<button
				type="button"
				disabled={files.length === 0 || isSubmitting}
				onclick={handleUpload}
				class="w-full rounded-lg bg-indigo-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
			>
				{isSubmitting ? 'Mengunggah...' : files.length === 0 ? 'Pilih berkas terlebih dahulu' : `Unggah ${files.length} Berkas`}
			</button>
		</div>
	</div>
</div>
