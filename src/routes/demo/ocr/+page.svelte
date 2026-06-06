<script lang="ts">
	import { PaddleOcrService } from 'ppu-paddle-ocr/web';

	let imageUrl = $state('');
	let result = $state('');
	let loading = $state(false);

	let file = $state<File | null>(null);

	let service: PaddleOcrService | null = null;

	async function handleFile(event: Event) {
		const input = event.target as HTMLInputElement;
		const selected = input.files?.[0];

		if (!selected) return;
		file = selected;
		imageUrl = URL.createObjectURL(selected);
	}

	async function runOCR() {
		if (!file) return;

		loading = true;

		try {
			if (!service) {
				service = new PaddleOcrService();
				await service.initialize();
			}

			const img = new Image();
			img.src = URL.createObjectURL(file);

			await new Promise((resolve) => {
				img.onload = resolve;
			});

			const canvas = document.createElement('canvas');

			canvas.width = img.width;

			canvas.height = img.height;

			const ctx = canvas.getContext('2d')!;

			ctx.drawImage(img, 0, 0);

			const ocrResult = await service.recognize(canvas);

			result = ocrResult.text;
		} catch (error) {
			console.error(error);

			result = String(error);
		} finally {
			loading = false;
		}
	}
</script>

<h1>OCR Test</h1>

<input type="file" accept="image/*" onchange={handleFile} />

<!-- {#if imageUrl} -->
<img src={imageUrl} alt="preview" style="max-width:600px" />

<button onclick={runOCR} disabled={loading} class="bg-blue-500 p-1 active:scale-98">
	{loading ? 'Processing...' : 'Run OCR'}
</button>
<!-- {/if} -->

<textarea rows="20" bind:value={result}></textarea>
