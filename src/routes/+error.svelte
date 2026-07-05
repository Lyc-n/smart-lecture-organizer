<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
</script>

<svelte:head>
	<title>{$page.status} — Smart Lecture Organizer</title>
</svelte:head>

<div class="flex min-h-screen items-center justify-center bg-bg-surface p-8">
	<div class="max-w-md text-center">
		<div class="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-bg-elevated border border-border-main">
			<svg class="h-8 w-8 text-text-muted" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
			</svg>
		</div>
		<h1 class="mb-2 text-4xl font-bold text-text-base">{$page.status}</h1>
		<p class="mb-8 text-sm text-text-secondary">{$page.error?.message ?? 'Terjadi kesalahan'}</p>
		<div class="flex items-center justify-center gap-3">
			<button
				type="button"
				onclick={() => goto('/')}
				class="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-primary-hover"
			>
				Ke Beranda
			</button>
			<button
				type="button"
				onclick={() => history.back()}
				class="rounded-lg border border-border-hover px-4 py-2 text-sm text-text-secondary transition hover:border-text-muted"
			>
				Kembali
			</button>
		</div>
	</div>
</div>
