<script lang="ts">
	let { data = $bindable() } = $props();
</script>

<div class="space-y-4">
	<input bind:value={data.title} placeholder="Title" />

	<input type="number" bind:value={data.weekNumber} />
</div>
