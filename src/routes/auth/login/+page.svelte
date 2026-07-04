<script lang="ts">
	import { authClient } from '$lib/stores/auth';
	import { goto } from '$app/navigation';

	let email = $state('');
	let password = $state('');
	let error = $state('');
	let loading = $state(false);

	async function handleSubmit(e: Event) {
		e.preventDefault();
		error = '';
		loading = true;

		const { error: authError } = await authClient.signIn.email({ email, password });

		loading = false;

		if (authError) {
			error = authError.message ?? 'Gagal masuk. Silakan coba lagi.';
			return;
		}

		goto('/app');
	}
</script>

<svelte:head>
	<title>Masuk — Smart Lecture Organizer</title>
</svelte:head>

<div class="min-h-screen bg-slate-950 light:bg-slate-50 text-slate-100 light:text-slate-900 flex items-center justify-center px-4">
	<div class="w-full max-w-sm">
		<a href="/" class="inline-flex items-center gap-2 text-2xl font-bold bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent mb-8">
			Smart Lecture Organizer
		</a>

		<h1 class="text-2xl font-bold mb-1">Masuk</h1>
		<p class="text-sm text-slate-400 light:text-slate-500 mb-6">Masuk ke akun Smart Lecture Organizer kamu</p>

		<form onsubmit={handleSubmit}>
			{#if error}
				<div class="mb-4 p-3 rounded-lg bg-red-900/40 border border-red-800 text-sm text-red-300">
					{error}
				</div>
			{/if}

			<div class="mb-4">
				<label for="email" class="block text-sm font-medium mb-1.5 text-slate-300 light:text-slate-600">Email</label>
				<input
					id="email"
					type="email"
					required
					bind:value={email}
					placeholder="nama@email.com"
					class="w-full px-4 py-2.5 rounded-lg bg-slate-800 light:bg-white border border-slate-700 light:border-slate-300 text-slate-100 light:text-slate-900 placeholder-slate-500 light:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
				/>
			</div>

			<div class="mb-6">
				<label for="password" class="block text-sm font-medium mb-1.5 text-slate-300 light:text-slate-600">Kata Sandi</label>
				<input
					id="password"
					type="password"
					required
					minlength={8}
					bind:value={password}
					placeholder="Minimal 8 karakter"
					class="w-full px-4 py-2.5 rounded-lg bg-slate-800 light:bg-white border border-slate-700 light:border-slate-300 text-slate-100 light:text-slate-900 placeholder-slate-500 light:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
				/>
			</div>

			<button
				type="submit"
				disabled={loading}
				class="w-full py-2.5 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-semibold"
			>
				{loading ? 'Memproses...' : 'Masuk'}
			</button>
		</form>

		<p class="mt-6 text-center text-sm text-slate-400 light:text-slate-500">
			Belum punya akun?
			<a href="/auth/register" class="text-indigo-400 hover:text-indigo-300 font-medium">Daftar</a>
		</p>
	</div>
</div>
