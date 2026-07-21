<script lang="ts">
	import '../app.css';
	import { init } from '$lib/stores/theme.svelte';
	import Toast from '$lib/components/atoms/Toast.svelte';

	init();

	let { children } = $props();
</script>

<svelte:head>
	<title>SmartLO</title>
</svelte:head>

<Toast />
{@render children()}
