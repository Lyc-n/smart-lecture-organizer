<script lang="ts">
	// import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';

	// let { data }: { data: PageServerData } = $props();
	let collapsed = $state(false);

	// Collapsed SideBar
	function toggle() {
		collapsed = !collapsed;
	}

	// Logout
	async function logout() {
		await fetch('/api/auth/sign-out', {
			method: 'POST'
		});
		// await goto(resolve('/auth'))
		window.location.reload();
	}

	const menus = [
		{ id: '1', href: '/app/home' as const, icon: 'ph-house', label: 'Home' },
		{ id: '2', href: '/app/saved' as const, icon: 'ph-bookmark', label: 'Saved' },
		{ id: '3', href: '/app/profile' as const, icon: 'ph-user-circle', label: 'Profile' }
	];
</script>

<aside
	class={`
		flex min-h-dvh flex-col bg-white shadow-sm
		transition-all duration-300 ease-in-out
		${collapsed ? 'w-16 pt-8 sm:w-20' : 'max-w-58 pt-6 sm:w-72'}
	`}
>
	<!-- Header -->
	<div
		class={`
			flex cursor-default items-center 
			px-3 transition-all
			duration-300 sm:px-4
			${collapsed ? 'justify-center' : 'gap-3 sm:gap-4'}
		`}
	>
		<button
			onclick={toggle}
			aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
			class="mt-1 transition-transform duration-300 hover:scale-105"
		>
			<i
				class={`
					ph-fill ph-graduation-cap
					bg-primary text-white transition-all duration-300

					${collapsed ? 'rounded-xl p-2 text-lg sm:text-xl' : 'rounded-2xl p-2.5 text-xl sm:p-3 sm:text-2xl'}
				`}
			></i>
		</button>

		<h2
			class={`
				text-base  font-semibold
				text-primary transition-all duration-300 ease-out
				sm:text-lg

				${
					collapsed
						? 'max-w-0 -translate-x-2 leading-2 opacity-0'
						: 'max-w-45 translate-x-0 leading-5 opacity-100'
				}
			`}
		>
			Smart Lecture Organizer
		</h2>
	</div>

	<!-- Navigation -->
	<div class="mt-4 py-4">
		{#each menus as item (item.id)}
			<a href={resolve(item.href)}>
				<div
					class={`
						flex cursor-pointer items-center
						border-primary py-3
						transition-all duration-300

						hover:bg-primary/10
						hover:text-text

						${
							page.url.pathname === item.href
								? 'border-e-4 border-primary bg-primary/10 font-medium text-primary'
								: 'text-innactive'
						}

						${collapsed ? 'justify-center px-0' : 'gap-5 px-4 sm:gap-8 sm:px-8'}
					`}
				>
					<button aria-label={item.label}>
						<i
							class={`${page.url.pathname === item.href ? 'ph-fill' : 'ph'} ${item.icon} shrink-0 text-lg sm:text-xl`}
						></i>
					</button>

					<p
						class={`
							overflow-hidden text-sm
							whitespace-nowrap transition-all duration-300 ease-out

							${collapsed ? 'max-w-0 -translate-x-2 opacity-0' : 'max-w-40 translate-x-0 opacity-100'}
						`}
					>
						{item.label}
					</p>
				</div>
			</a>
		{/each}
	</div>

	<!-- Footer -->
	<div class="flex h-full flex-col-reverse py-4">
		<button
			class={`
				flex w-full cursor-pointer items-center
				py-3 text-error/70
				transition-all duration-300

				hover:bg-error/10
				hover:text-error

				${collapsed ? 'justify-center px-0' : 'gap-5 px-4 sm:gap-8 sm:px-8'}
			`}
			onclick={logout}
		>
			<i class="ph ph-sign-out shrink-0 text-lg sm:text-xl"></i>

			<p
				class={`
					overflow-hidden text-sm
					whitespace-nowrap transition-all duration-300 ease-out

					${collapsed ? 'max-w-0 -translate-x-2 opacity-0' : 'max-w-40 translate-x-0 opacity-100'}
				`}
			>
				Logout
			</p>
		</button>

		<div
			class={`
				flex cursor-pointer items-center
				py-3 text-innactive
				transition-all duration-300

				hover:bg-warning/10
				hover:text-warning

				${collapsed ? 'justify-center px-0' : 'gap-5 px-4 sm:gap-8 sm:px-8'}
			`}
		>
			<i class="ph ph-question shrink-0 text-lg sm:text-xl"></i>

			<p
				class={`
					overflow-hidden text-sm
					whitespace-nowrap transition-all duration-300 ease-out

					${collapsed ? 'max-w-0 -translate-x-2 opacity-0' : 'max-w-40 translate-x-0 opacity-100'}
				`}
			>
				Help
			</p>
		</div>

		<div class="mx-3 my-3 border border-innactive/20 sm:mx-5"></div>
	</div>
</aside>
