<script lang="ts">
	import { page } from '$app/state';
	import { Button } from '$lib/components/ui/button/index.js';
</script>

<svelte:head>
	<title>{page.status} - {page.error?.message ?? 'Error'}</title>
</svelte:head>

<div class="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
	<h1 class="text-8xl font-bold text-primary">{page.status}</h1>
	<p class="text-xl text-muted-foreground">
		{page.error?.message ?? 'An unexpected error occurred'}
	</p>

	<div class="mt-4 flex gap-3">
		<Button onclick={() => (window.location.href = '/')}>
			Back to Home
		</Button>

		<Button variant="outline" onclick={() => window.history.back()}>
			Go Back
		</Button>
	</div>
</div>
