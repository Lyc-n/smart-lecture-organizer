<script lang="ts">
	import { enhance } from '$app/forms';
	import CreateSubject from './createSubject.svelte';
	import Button from './ui/button/button.svelte';

	let creating = $state(false);
	let open = $state(false);
</script>

<div class="fixed right-6 bottom-6 z-50">
	{#if open}
		<div class="absolute right-0 bottom-18 flex flex-col items-end gap-2">
			<form
				method="POST"
				action="?/createNote"
				use:enhance={() => {
					creating = true;
					return async ({ update }) => {
						creating = false;
						await update();
					};
				}}
			>
				<Button type="submit" variant="outline" disabled={creating}>
					<i class="ph ph-note-pencil text-lg"></i>
					<p class="text-sm">{creating ? 'Creating...' : 'Create Note'}</p>
				</Button>
			</form>

			<Button variant="outline">
				<i class="ph ph-upload-simple"></i>
				Add Material
			</Button>

			<CreateSubject />
		</div>
	{/if}

	<Button size="icon" class="h-14 w-14 rounded-full shadow-lg" onclick={() => (open = !open)}>
		<i class={`ph-bold ph-plus ${open ? 'rotate-45' : ''} text-xl transition-all duration-150`}></i>
	</Button>
</div>
