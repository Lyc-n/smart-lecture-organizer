<script lang="ts">
	import { enhance } from '$app/forms';

	let { form } = $props();
</script>

<svelte:head>
	<title>Keluar — Smart Lecture Organizer</title>
</svelte:head>

<div class="min-h-screen bg-slate-950 light:bg-slate-50 text-slate-100 light:text-slate-900 flex items-center justify-center px-4">
	<div class="w-full max-w-sm text-center">
		<h1 class="text-2xl font-bold mb-2">Keluar</h1>
		<p class="text-sm text-slate-400 light:text-slate-500 mb-8">Apakah kamu yakin ingin keluar dari Smart Lecture Organizer?</p>

		<form method="POST" use:enhance>
			<button
				type="submit"
				class="w-full py-2.5 rounded-lg bg-red-600 hover:bg-red-500 transition-colors font-semibold"
			>
				Ya, Keluar
			</button>
		</form>

		<a
			href="/app"
			class="mt-4 inline-block text-sm text-slate-400 light:text-slate-500 hover:text-slate-100 light:hover:text-slate-900 transition-colors"
		>
			Batal
		</a>
	</div>
</div>
