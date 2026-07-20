<script lang="ts">
	import { page } from '$app/stores';
	import { getCurrentMode, setTheme } from '$lib/stores/theme.svelte';
	import type { ThemeMode } from '$lib/stores/theme.svelte';

	const limit = $derived($page.data.limit ?? 52428800);
	const used = $derived($page.data.used ?? 0);
	const percentage = $derived(Math.min(Math.round((used / limit) * 100), 100));

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
</script>

<svelte:head>
	<title>Pengaturan — Smart Lecture Organizer</title>
</svelte:head>

<div class="min-h-screen bg-bg-surface text-text-base p-8">
	<div class="mx-auto max-w-lg">
		<h1 class="text-2xl font-bold mb-8">Pengaturan</h1>

		<section class="rounded-xl bg-bg-elevated border border-border-main p-6">
			<h2 class="text-lg font-semibold mb-1">Tema</h2>
			<p class="text-sm text-text-secondary mb-4">Pilih tampilan aplikasi</p>

			<div class="flex gap-3">
				{#each themeOptions as opt}
					<button
						type="button"
						onclick={() => setTheme(opt.value)}
						class="flex flex-1 items-center gap-2 rounded-lg border px-4 py-3 text-sm transition {getCurrentMode() === opt.value ? 'border-primary bg-primary/10 text-primary' : 'border-border-hover text-text-secondary hover:border-text-muted'}"
					>
						<span class="flex h-4 w-4 shrink-0 items-center justify-center rounded-full border {getCurrentMode() === opt.value ? 'border-primary' : 'border-text-muted'}">
							{#if getCurrentMode() === opt.value}
								<span class="h-2 w-2 rounded-full bg-primary"></span>
							{/if}
						</span>
						{opt.label}
					</button>
				{/each}
			</div>
		</section>

		<section class="mt-6 rounded-xl bg-bg-elevated border border-border-main p-6">
			<h2 class="text-lg font-semibold mb-1">Penyimpanan</h2>
			<p class="text-sm text-text-secondary mb-4">Total penyimpanan yang digunakan</p>

			<div class="mb-3">
				<div class="flex items-center justify-between text-sm mb-1.5">
					<span class="text-text-secondary">{formatBytes(used)}</span>
					<span class="text-text-muted">
						{formatBytes(limit)}
						({percentage}%)
					</span>
				</div>
				<div class="h-2.5 w-full rounded-full bg-bg-hover overflow-hidden">
					<div
						class="h-full rounded-full transition-all duration-300"
						class:bg-tertiary={percentage >= 80}
						class:bg-danger={percentage >= 95}
						class:bg-primary={percentage < 80}
						style="width: {percentage}%"
					></div>
				</div>
			</div>

			{#if percentage >= 95}
				<p class="text-xs text-danger mt-2">Penyimpanan hampir penuh. Hapus beberapa item untuk melanjutkan upload.</p>
			{:else if percentage >= 80}
				<p class="text-xs text-tertiary mt-2">Penyimpanan hampir habis. Pertimbangkan untuk menghapus item yang tidak diperlukan.</p>
			{/if}
		</section>
	</div>
</div>
