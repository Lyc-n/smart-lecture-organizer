<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import PwaUpdate from '$lib/components/pwa-update.svelte';
	import PwaInstall from '$lib/components/pwa-install.svelte';
	// import Sidebar from '$lib/components/Sidebar.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<link rel="manifest" href="/manifest.webmanifest" />
	<meta name="apple-mobile-web-app-capable" content="yes" />
	<meta name="apple-mobile-web-app-status-bar-style" content="default" />
	<meta name="apple-mobile-web-app-title" content="SLO" />
	<meta name="theme-color" content="#3b82f6" />
</svelte:head>

<div class="flex min-h-screen bg-slate-50 font-sans text-slate-900">
	<!-- <Sidebar /> -->
	<main class="min-w-0 flex-1">
		{@render children()}
	</main>
</div>

<PwaUpdate />
<PwaInstall />
