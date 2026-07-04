<script lang="ts">
	import '../app.css';
	import { init } from '$lib/stores/theme.svelte';

	init();

	let { children } = $props();
</script>

<svelte:head>
	<title>Smart Lecture Organizer</title>
</svelte:head>

{@render children()}
