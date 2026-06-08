<script lang="ts">
	let { data = $bindable() } = $props();
</script>

<div class="space-y-4">
	<input bind:value={data.title} placeholder="Title" />

	<input type="file" />
</div>
