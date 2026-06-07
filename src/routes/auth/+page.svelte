<script lang="ts">
	import { enhance } from '$app/forms';

	import Button from '$lib/components/ui/button/button.svelte';
	import Card from '$lib/components/ui/card/card.svelte';
	import Input from '$lib/components/ui/input/input.svelte';

	let password = $state('');
	let passwordConfirm = $state('');
	let show = $state(false);

	const passwordsMatch = $derived(
		password.length > 0 &&
		passwordConfirm.length > 0 &&
		password === passwordConfirm
	);

	function setShow() {
		show = !show
	}

	async function reload(){
		await new Promise((resolve) => setTimeout(resolve, 600));
		window.location.reload()
	}

	let active = $state<'login' | 'register'>('login');
</script>

<div class="flex h-screen items-center justify-center gap-2 bg-background px-8">
	<Card
		class={`
			overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]
			${active === 'login'
				? 'w-md scale-x-100 opacity-100 p-8'
				: 'w-1 h-112 scale-x-95 opacity-80 p-1 cursor-default'}
		`}
	>
		{#if active === 'login'}
			<h1 class="mb-6 text-4xl font-medium">
				Login
			</h1>

			<form
				action="/api/auth/sign-in/email"
				method="POST"
				use:enhance
			>
				<div class="space-y-4">
					<label class="block text-xs">
						Email
						<Input
							type="email"
							name="email"
							class="mt-2 bg-white ring ring-innactive"
						/>
					</label>

					<label class="block text-xs relative">
						Password
						<Input
							type={show ? 'text' : 'password'}
							name="password"
							class="mt-2 bg-white ring ring-innactive"
						/>
						<button onclick={setShow} aria-label="show" class="absolute right-3 bottom-1.5 h-fit w-fit flex">
							<i class={`ph ${show ? 'ph-eye':'ph-eye-slash'} text-innactive text-2xl`}></i>
						</button>
					</label>
				</div>

				<div class="mt-8 flex flex-col gap-2">
					<Button type="submit" onclick={reload}>
						Login
					</Button>

					<Button
						type="button"
						variant="outline"
						onclick={() => (active = 'register')}
					>
						Create Account
					</Button>
				</div>
			</form>
		{/if}
	</Card>
	<Card
		class={`
			overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] min-h-fit h-140
			${active === 'register'
				? 'w-md scale-x-100 opacity-100 p-8'
				: 'w-1 scale-y-60 scale-x-95 opacity-80 p-1 cursor-default'}
		`}
	>
		{#if active === 'register'}
			<h1 class="mb-6 text-4xl font-medium">
				Register
			</h1>

			<form
				action="/api/auth/sign-up/email"
				method="POST"
				use:enhance
			>
				<div class="space-y-4">
					<label class="block text-xs">
						Username
						<Input
							required={true}
							type="text"
							name="name"
							class="mt-2 bg-white ring ring-innactive"
						/>
					</label>

					<label class="block text-xs">
						Email
						<Input
							required={true}
							type="email"
							name="email"
							class="mt-2 bg-white ring ring-innactive"
						/>
					</label>

					<label class="block text-xs relative">
						Password
						<Input
							required={true}
							type={show ? 'text' : 'password'}
							name="password"
							bind:value={password}
							class="mt-2 bg-white ring ring-innactive"
						/>
						<button onclick={setShow} aria-label="show" class="absolute right-3 bottom-1.5 h-fit w-fit flex">
							<i class={`ph ${show ? 'ph-eye':'ph-eye-slash'} text-innactive text-2xl`}></i>
						</button>
					</label>

					<label class="block text-xs">
						Repeat Password
						<Input
							required={true}
							type={show ? 'text' : 'password'}
							name="passwordConfirm"
							bind:value={passwordConfirm}
							class="mt-2 bg-white ring ring-innactive"
						/>
					</label>
					{#if passwordConfirm.length > 0}
						<p
							class={`absolute -translate-y-3 text-xs ${
								passwordsMatch
									? 'text-green-600'
									: 'text-red-600'
							}`}
						>
							{passwordsMatch
								? 'Password cocok'
								: 'Password tidak cocok'}
						</p>
					{/if}
				</div>

				<div class="mt-8 flex flex-col gap-2">
					<Button type="submit" disabled={!passwordsMatch} onclick={reload}>
						Register
					</Button>

					<Button
						type="button"
						variant="outline"
						onclick={() => (active = 'login')}
					>
						Back to Login
					</Button>
				</div>
			</form>
		{/if}
	</Card>
</div>