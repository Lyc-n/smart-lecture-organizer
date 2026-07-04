<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import {
		saveDirectoryHandle,
		getWatcherState,
		removeWatcherState,
		startFileWatcher,
		stopFileWatcher,
		onNewFile
	} from '$lib/stores/offline';
	import { getCurrentMode, setTheme } from '$lib/stores/theme.svelte';
	import type { ThemeMode } from '$lib/stores/theme.svelte';

	const limit = $derived($page.data.limit ?? 52428800);
	const used = $derived($page.data.used ?? 0);
	const percentage = $derived(Math.min(Math.round((used / limit) * 100), 100));

	let folderName = $state('');
	let watcherActive = $state(false);
	let watcherSupported = $state(typeof window !== 'undefined' && 'showDirectoryPicker' in (window as unknown as Record<string, unknown>));
	let detectedFiles = $state<string[]>([]);

	$effect(() => {
		getWatcherState().then((state) => {
			if (state?.handle) {
				folderName = state.folderName;
				watcherActive = true;
				startFileWatcher();
			}
		});

		const unsub = onNewFile((name) => {
			detectedFiles = [...detectedFiles, name];
		});
		return () => {
			stopFileWatcher();
			unsub();
		};
	});

	const themeOptions: { label: string; value: ThemeMode }[] = [
		{ label: 'Terang', value: 'light' },
		{ label: 'Gelap', value: 'dark' },
		{ label: 'Ikuti Sistem', value: 'system' }
	];

	function formatBytes(bytes: number): string {
		if (bytes === 0) return '0 B';
		const units = ['B', 'KB', 'MB', 'GB'];
		const i = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
		const value = bytes / Math.pow(1024, i);
		return `${value.toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
	}

	async function enableWatcher() {
		try {
			const handle = await (window as unknown as { showDirectoryPicker(): Promise<FileSystemDirectoryHandle> }).showDirectoryPicker();
			await saveDirectoryHandle(handle);
			folderName = handle.name;
			watcherActive = true;
			detectedFiles = [];
			startFileWatcher();
		} catch {
			// user cancelled
		}
	}

	async function disableWatcher() {
		stopFileWatcher();
		await removeWatcherState();
		folderName = '';
		watcherActive = false;
		detectedFiles = [];
	}
</script>

<svelte:head>
	<title>Pengaturan — Smart Lecture Organizer</title>
</svelte:head>

<div class="min-h-screen bg-slate-950 light:bg-slate-50 text-slate-100 light:text-slate-900 p-8">
	<div class="mx-auto max-w-lg">
		<h1 class="text-2xl font-bold mb-8">Pengaturan</h1>

		<section class="rounded-xl bg-slate-900 light:bg-white border border-slate-800 light:border-slate-200 p-6">
			<h2 class="text-lg font-semibold mb-1">Tema</h2>
			<p class="text-sm text-slate-400 light:text-slate-500 mb-4">Pilih tampilan aplikasi</p>

			<div class="flex gap-3">
				{#each themeOptions as opt}
					<button
						type="button"
						onclick={() => setTheme(opt.value)}
						class="flex flex-1 items-center gap-2 rounded-lg border px-4 py-3 text-sm transition {getCurrentMode() === opt.value ? 'border-indigo-500 bg-indigo-500/10 text-indigo-400' : 'border-slate-700 light:border-slate-300 text-slate-300 light:text-slate-600 hover:border-slate-600 light:hover:border-slate-400'}"
					>
						<span class="flex h-4 w-4 shrink-0 items-center justify-center rounded-full border {getCurrentMode() === opt.value ? 'border-indigo-500' : 'border-slate-600 light:border-slate-300'}">
							{#if getCurrentMode() === opt.value}
								<span class="h-2 w-2 rounded-full bg-indigo-500"></span>
							{/if}
						</span>
						{opt.label}
					</button>
				{/each}
			</div>
		</section>

		<section class="mt-6 rounded-xl bg-slate-900 light:bg-white border border-slate-800 light:border-slate-200 p-6">
			<h2 class="text-lg font-semibold mb-1">Penyimpanan</h2>
			<p class="text-sm text-slate-400 light:text-slate-500 mb-4">Total penyimpanan yang digunakan</p>

			<div class="mb-3">
				<div class="flex items-center justify-between text-sm mb-1.5">
					<span class="text-slate-300 light:text-slate-700">{formatBytes(used)}</span>
					<span class="text-slate-500 light:text-slate-400">
						{formatBytes(limit)}
						({percentage}%)
					</span>
				</div>
				<div class="h-2.5 w-full rounded-full bg-slate-800 light:bg-slate-200 overflow-hidden">
					<div
						class="h-full rounded-full transition-all duration-300"
						class:bg-amber-500={percentage >= 80}
						class:bg-red-500={percentage >= 95}
						class:bg-indigo-500={percentage < 80}
						style="width: {percentage}%"
					></div>
				</div>
			</div>

			{#if percentage >= 95}
				<p class="text-xs text-red-400 light:text-red-600 mt-2">Penyimpanan hampir penuh. Hapus beberapa item untuk melanjutkan upload.</p>
			{:else if percentage >= 80}
				<p class="text-xs text-amber-400 light:text-amber-600 mt-2">Penyimpanan hampir habis. Pertimbangkan untuk menghapus item yang tidak diperlukan.</p>
			{/if}
		</section>

		<section class="mt-6 rounded-xl bg-slate-900 light:bg-white border border-slate-800 light:border-slate-200 p-6">
			<h2 class="text-lg font-semibold mb-1">Folder Download</h2>
			<p class="text-sm text-slate-400 light:text-slate-500 mb-4">Pantau folder untuk upload otomatis</p>

			{#if !watcherSupported}
				<div class="rounded-lg bg-amber-900/30 light:bg-amber-100/50 border border-amber-800 light:border-amber-300 p-3 text-sm text-amber-300 light:text-amber-700">
					Fitur ini hanya tersedia di browser Chromium (Google Chrome, Edge, dll).
				</div>
			{:else if watcherActive}
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm text-slate-200 light:text-slate-700">{folderName}</p>
						<p class="text-xs text-slate-500 light:text-slate-400">Dipantau setiap 30 detik</p>
					</div>
					<button
						type="button"
						onclick={disableWatcher}
						class="rounded-lg border border-red-800 light:border-red-300 px-3 py-1.5 text-sm text-red-400 light:text-red-600 transition hover:bg-red-900/30 light:hover:bg-red-100/30"
					>
						Nonaktifkan
					</button>
				</div>

				{#if detectedFiles.length > 0}
					<div class="mt-4 space-y-2">
						<p class="text-xs text-slate-500 light:text-slate-400">File baru terdeteksi:</p>
						{#each detectedFiles as name}
							<div class="flex items-center justify-between rounded-lg bg-slate-800 light:bg-slate-100 p-2">
								<span class="truncate text-sm text-slate-200 light:text-slate-700">{name}</span>
								<button
									type="button"
									onclick={() => goto(`/app/items/upload`)}
									class="shrink-0 rounded-md bg-indigo-600 px-2.5 py-1 text-xs font-medium text-white transition hover:bg-indigo-500"
								>
									Upload
								</button>
							</div>
						{/each}
					</div>
				{/if}
			{:else}
				<button
					type="button"
					onclick={enableWatcher}
					class="flex items-center gap-2 rounded-lg border border-slate-700 light:border-slate-300 px-4 py-2 text-sm text-slate-300 light:text-slate-600 transition hover:border-slate-600 light:hover:border-slate-400 hover:text-slate-100 light:hover:text-slate-900"
				>
					<svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
					</svg>
					Pilih Folder
				</button>
			{/if}
		</section>
	</div>
</div>
