<script lang="ts">
	import AppSidebar from '$lib/components/app-sidebar.svelte';

	let { children } = $props();
</script>

<div class="flex h-screen">
	<AppSidebar />
	<!-- <p>{data.user.name}</p> -->
	<main class="flex-1 overflow-y-auto">
		{@render children()}
	</main>
</div>
