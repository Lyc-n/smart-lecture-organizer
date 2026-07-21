<script lang="ts">
	import { authClient } from '$lib/stores/auth';
	import { goto } from '$app/navigation';
	import Input from '$lib/components/atoms/Input.svelte';
	import Button from '$lib/components/atoms/Button.svelte';

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
	<title>Masuk — SmartLO</title>
</svelte:head>

<div class="min-h-screen bg-bg-surface text-text-base flex items-center justify-center px-4">
	<div class="w-full max-w-sm">
		<a href="/" class="inline-flex items-center gap-2 text-2xl font-bold bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent mb-8">
			SmartLO
		</a>

		<h1 class="text-2xl font-bold mb-1">Masuk</h1>
		<p class="text-sm text-text-secondary mb-6">Masuk ke akun SmartLO kamu</p>

		<form onsubmit={handleSubmit}>
			{#if error}
				<div class="mb-4 p-3 rounded-lg bg-danger/40 border border-danger text-sm text-danger">
					{error}
				</div>
			{/if}

			<div class="mb-4">
				<label for="email" class="block text-sm font-medium mb-1.5 text-text-secondary">Email</label>
				<Input
					id="email"
					type="email"
					required
					bind:value={email}
					placeholder="nama@email.com"
				/>
			</div>

			<div class="mb-6">
				<label for="password" class="block text-sm font-medium mb-1.5 text-text-secondary">Kata Sandi</label>
				<Input
					id="password"
					type="password"
					required
					minlength={8}
					bind:value={password}
					placeholder="Minimal 8 karakter"
				/>
			</div>

			<Button type="submit" disabled={loading} loading={loading} class="w-full">
				{loading ? 'Memproses...' : 'Masuk'}
			</Button>
		</form>

		<p class="mt-6 text-center text-sm text-text-secondary">
			Belum punya akun?
			<a href="/auth/register" class="text-primary hover:text-primary-hover font-medium">Daftar</a>
		</p>
	</div>
</div>
