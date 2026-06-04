<script lang="ts">
	import { createUploader } from '$lib/utils/uploadthing';
	import { Uploader, UploadButton } from '@uploadthing/svelte';
	const uploader = createUploader('materiUploader',{
    onClientUploadComplete: (res) => {
      console.log(`onClientUploadComplete`, res);
      alert("Upload Completed");
    },
    onUploadError: (error: Error) => {
      alert(`ERROR! ${error.message}`);
    },		
	});
</script>

<div class="flex flex-row">
	<div>
		<!-- <Uploader {uploader} /> -->
		<h1>Welcome to SvelteKit</h1>
		<p>
			Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation
		</p>
		<UploadButton class="pt-10" {uploader}/>

		<h2 class="text-9xl font-bold text-amber-500">hello world</h2>
	</div>
</div>
