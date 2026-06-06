<script lang="ts">
	import { resolve } from '$app/paths';
</script>

<div class="p-4">
	<a
		href={resolve('/demo/ocr')}
		class="rounded-lg bg-blue-600 px-4 py-1 text-white active:scale-98 active:bg-blue-700">OCR</a
	>
	<a
		href={resolve('/demo/better-auth')}
		class="rounded-lg bg-blue-600 px-4 py-1 text-white active:scale-98 active:bg-blue-700"
		>better-auth</a
	>
</div>
