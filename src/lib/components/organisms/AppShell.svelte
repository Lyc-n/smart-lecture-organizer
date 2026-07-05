<script lang="ts">
	import Sidebar from './Sidebar.svelte';
	import Topbar from './Topbar.svelte';

	let {
		children,
		overdueCount = 0
	}: {
		children: import('svelte').Snippet;
		overdueCount?: number;
	} = $props();

	let sidebarOpen = $state(false);
	let collapsed = $state(false);

	function initCollapsed() {
		if (typeof window === 'undefined') return;
		const saved = localStorage.getItem('slo-sidebar-collapsed');
		collapsed = saved === 'true';
	}

	function toggleCollapse() {
		collapsed = !collapsed;
		if (typeof window !== 'undefined') {
			localStorage.setItem('slo-sidebar-collapsed', String(collapsed));
		}
	}

	function closeSidebar() {
		sidebarOpen = false;
	}

	$effect(() => {
		initCollapsed();
	});
</script>

<svelte:window onkeydown={(e) => e.key === 'Escape' && closeSidebar()} />

{#if sidebarOpen}
	<!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
	<div
		class="fixed inset-0 z-30 bg-black/50 lg:hidden"
		onclick={closeSidebar}
	></div>
{/if}

<div class="flex h-dvh bg-bg-base">
	<Sidebar open={sidebarOpen} {collapsed} {overdueCount} onToggleCollapse={toggleCollapse} />

	<div class="flex flex-1 flex-col min-w-0">
		<Topbar onMenuToggle={() => (sidebarOpen = !sidebarOpen)} />
		<main class="flex-1 overflow-auto">
			{@render children()}
		</main>
	</div>
</div>
