<script lang="ts">
	import { authClient } from '$lib/stores/auth';
	import { goto } from '$app/navigation';

	let name = $state('');
	let email = $state('');
	let password = $state('');
	let confirmPassword = $state('');
	let error = $state('');
	let loading = $state(false);

	async function handleSubmit(e: Event) {
		e.preventDefault();
		error = '';

		if (password !== confirmPassword) {
			error = 'Kata sandi tidak cocok.';
			return;
		}

		loading = true;

		const { error: authError } = await authClient.signUp.email({ name, email, password });

		loading = false;

		if (authError) {
			error = authError.message ?? 'Gagal mendaftar. Silakan coba lagi.';
			return;
		}

		goto('/app');
	}
</script>

<svelte:head>
	<title>Daftar — Smart Lecture Organizer</title>
</svelte:head>

<div class="min-h-screen bg-bg-surface text-text-base flex items-center justify-center px-4">
	<div class="w-full max-w-sm">
		<a href="/" class="inline-flex items-center gap-2 text-2xl font-bold bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent mb-8">
			Smart Lecture Organizer
		</a>

		<h1 class="text-2xl font-bold mb-1">Daftar</h1>
		<p class="text-sm text-text-secondary mb-6">Buat akun Smart Lecture Organizer baru</p>

		<form onsubmit={handleSubmit}>
			{#if error}
				<div class="mb-4 p-3 rounded-lg bg-danger/40 border border-danger text-sm text-danger">
					{error}
				</div>
			{/if}

			<div class="mb-4">
				<label for="name" class="block text-sm font-medium mb-1.5 text-text-secondary">Nama</label>
				<input
					id="name"
					type="text"
					required
					bind:value={name}
					placeholder="Nama lengkap"
					class="w-full px-4 py-2.5 rounded-lg bg-bg-hover border border-border-hover text-text-base placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
				/>
			</div>

			<div class="mb-4">
				<label for="email" class="block text-sm font-medium mb-1.5 text-text-secondary">Email</label>
				<input
					id="email"
					type="email"
					required
					bind:value={email}
					placeholder="nama@email.com"
					class="w-full px-4 py-2.5 rounded-lg bg-bg-hover border border-border-hover text-text-base placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
				/>
			</div>

			<div class="mb-4">
				<label for="password" class="block text-sm font-medium mb-1.5 text-text-secondary">Kata Sandi</label>
				<input
					id="password"
					type="password"
					required
					minlength={8}
					bind:value={password}
					placeholder="Minimal 8 karakter"
					class="w-full px-4 py-2.5 rounded-lg bg-bg-hover border border-border-hover text-text-base placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
				/>
			</div>

			<div class="mb-6">
				<label for="confirm-password" class="block text-sm font-medium mb-1.5 text-text-secondary">Konfirmasi Kata Sandi</label>
				<input
					id="confirm-password"
					type="password"
					required
					minlength={8}
					bind:value={confirmPassword}
					placeholder="Ulangi kata sandi"
					class="w-full px-4 py-2.5 rounded-lg bg-bg-hover border border-border-hover text-text-base placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
				/>
			</div>

			<button
				type="submit"
				disabled={loading}
				class="w-full py-2.5 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-semibold"
			>
				{loading ? 'Memproses...' : 'Daftar'}
			</button>
		</form>

		<p class="mt-6 text-center text-sm text-text-secondary">
			Sudah punya akun?
			<a href="/auth/login" class="text-primary hover:text-primary-hover font-medium">Masuk</a>
		</p>
	</div>
</div>
