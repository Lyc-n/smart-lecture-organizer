<script lang="ts">
	let { data = $bindable() } = $props();
</script>

<input type="text" bind:value={data.title} />
<textarea bind:value={data.content} placeholder="Write note..."></textarea>
