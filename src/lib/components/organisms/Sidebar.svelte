<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import NavItem from '$lib/components/molecules/NavItem.svelte';

	let {
		open = true,
		collapsed = false,
		overdueCount = 0,
		onToggleCollapse
	}: {
		open?: boolean;
		collapsed?: boolean;
		overdueCount?: number;
		onToggleCollapse?: () => void;
	} = $props();

	const navItems = [
		{ label: 'Dashboard', icon: 'dashboard', path: '/app' },
		{ label: 'Grup', icon: 'folder', path: '/app/groups' },
		{ label: 'Tugas', icon: 'tasks', path: '/app/tasks', badge: overdueCount },
		{ label: 'Bookmark', icon: 'bookmark', path: '/app/bookmarks' },
		{ label: 'Cari', icon: 'search', path: '/app/search' }
	] as const;

	function isActive(path: string): boolean {
		if (path === '/app') return $page.url.pathname === '/app';
		return $page.url.pathname.startsWith(path);
	}
</script>

<nav
	class="fixed inset-y-0 left-0 z-40 flex flex-col bg-slate-950 light:bg-white border-r border-slate-800 light:border-slate-200 transition-all duration-200 {collapsed ? 'w-16' : 'w-60'} {open ? 'translate-x-0' : '-translate-x-full'} lg:static lg:translate-x-0"
>
	<!-- Header: Logo + Toggle -->
	<div class="flex h-14 items-center {collapsed ? 'justify-center' : 'gap-2 px-4'} border-b border-slate-800 light:border-slate-200">
		<button
			type="button"
			onclick={onToggleCollapse}
			class="flex h-7 w-7 shrink-0 items-center justify-center transition hover:opacity-80"
			title={collapsed ? 'Perluas sidebar' : 'Ciutkan sidebar'}
		>
			<img src="/favicon.svg" alt="SLO" class="h-7 w-7" />
		</button>
		{#if !collapsed}
			<span class="text-sm font-bold text-slate-100 light:text-slate-900">Smart Lecture Organizer</span>
		{/if}
	</div>

	<!-- Navigation Items -->
	<div class="flex-1 overflow-y-auto {collapsed ? 'p-2' : 'p-3'} space-y-1">
		{#each navItems as item}
			<div class="relative">
				<NavItem
					label={item.label}
					icon={item.icon}
					path={item.path}
					active={isActive(item.path)}
					collapsed={collapsed}
					onclick={() => goto(item.path)}
				/>
			</div>
		{/each}
	</div>

	<!-- Bottom Actions -->
	<div class="{collapsed ? 'p-2' : 'p-3'} space-y-1 border-t border-slate-800 light:border-slate-200">
		<NavItem
			label="Bantuan"
			icon="help"
			collapsed={collapsed}
			variant="warning"
			onclick={() => window.open('https://github.com/anomalyco/opencode/issues', '_blank')}
		/>
		<form action="/auth/logout" method="POST">
			<NavItem
				label="Keluar"
				icon="logout"
				collapsed={collapsed}
				variant="danger"
				type="submit"
			/>
		</form>
	</div>
</nav>
