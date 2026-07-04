<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import ListIcon from 'phosphor-svelte/lib/ListIcon';
	import GearIcon from 'phosphor-svelte/lib/GearIcon';
	import SignOutIcon from 'phosphor-svelte/lib/SignOutIcon';
	import CaretDownIcon from 'phosphor-svelte/lib/CaretDownIcon';
	import Avatar from '$lib/components/atoms/Avatar.svelte';
	import SearchBar from '$lib/components/molecules/SearchBar.svelte';
	import StorageIndicator from '$lib/components/molecules/StorageIndicator.svelte';

	let { onMenuToggle }: { onMenuToggle?: () => void } = $props();

	let userMenuOpen = $state(false);

	function toggleMenu() {
		userMenuOpen = !userMenuOpen;
	}

	function closeMenu() {
		userMenuOpen = false;
	}
</script>

<header class="flex h-14 items-center justify-between border-b border-slate-800 light:border-slate-200 bg-slate-950 light:bg-white px-4">
	<div class="flex items-center gap-3">
		<button
			type="button"
			onclick={(e) => { e.stopPropagation(); onMenuToggle?.(); }}
			class="rounded-md p-1.5 text-slate-400 light:text-slate-500 transition hover:bg-slate-800 light:hover:bg-slate-100 hover:text-slate-200 light:hover:text-slate-700 lg:hidden"
			aria-label="Toggle menu"
		>
			<ListIcon size={20} />
		</button>

		<SearchBar />
	</div>

	<div class="flex items-center gap-4">
		<StorageIndicator />

		<div class="relative">
			<button
				type="button"
				onclick={toggleMenu}
				class="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-slate-300 light:text-slate-700 transition hover:bg-slate-800 light:hover:bg-slate-100"
			>
				<Avatar name={$page.data.user?.name ?? $page.data.user?.email ?? '?'} size="md" />
				<span class="hidden max-w-[120px] truncate sm:inline">
					{$page.data.user?.name ?? $page.data.user?.email}
				</span>
				<CaretDownIcon size={16} class="hidden text-slate-500 light:text-slate-400 sm:block" />
			</button>

			{#if userMenuOpen}
				<!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
				<div class="fixed inset-0 z-10" onclick={closeMenu}></div>
				<div class="absolute right-0 top-full mt-1 z-20 w-48 rounded-xl border border-slate-700 light:border-slate-300 bg-slate-900 light:bg-white p-1 shadow-lg">
					<button
						type="button"
						onclick={() => { goto('/app/settings'); userMenuOpen = false; }}
						class="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-300 light:text-slate-700 transition hover:bg-slate-800 light:hover:bg-slate-100"
					>
						<GearIcon size={16} />
						Pengaturan
					</button>
					<form action="/auth/logout" method="POST">
						<button
							type="submit"
							class="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-300 light:text-slate-700 transition hover:bg-slate-800 light:hover:bg-slate-100"
						>
							<SignOutIcon size={16} />
							Keluar
						</button>
					</form>
				</div>
			{/if}
		</div>
	</div>
</header>
