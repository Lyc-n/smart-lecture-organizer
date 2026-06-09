<script lang="ts">
	let file = $state<File | null>(null);
	let loading = $state(false);
	let result = $state('');

	// let file: File | null = null;
	let preview = $state('');

	function handleFile(e: Event) {
		const target = e.target as HTMLInputElement;

		file = target.files?.[0] ?? null;

		if (file) {
			preview = URL.createObjectURL(file);
		}
	}

	async function handleUpload() {
		if (!file) return;

		loading = true;

		const formData = new FormData();
		formData.append('file', file);

		try {
			const response = await fetch('/api/ocr', {
				method: 'POST',
				body: formData
			});

			const data = await response.json();

			console.log(data);

			result = data.ParsedResults?.[0]?.ParsedText ?? JSON.stringify(data, null, 2);
		} catch (err) {
			console.error(err);
		}

		loading = false;
	}
</script>

<div class="space-y-4">
	<!-- <input
	type="file"
	accept="image/*"
	onchange={(e) => {
		file = e.currentTarget.files?.[0] ?? null;
		}}
		/> -->
	{#if preview}
		<img src={preview} alt="preview" class="max-w-md rounded" />
	{/if}
	<input type="file" accept="image/*" onchange={handleFile} />

	<button onclick={handleUpload} disabled={!file || loading}>
		{loading ? 'Memproses...' : 'OCR'}
	</button>

	{#if result}
		<textarea rows="10" class="w-full border p-2" bind:value={result}></textarea>
	{/if}
</div>
