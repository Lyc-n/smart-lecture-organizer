<script lang="ts">
	let { data = $bindable() } = $props();
</script>

<div class="space-y-4">
	<input bind:value={data.name} placeholder="Subject Name" />

	<textarea bind:value={data.description} placeholder="Description"></textarea>
</div>
