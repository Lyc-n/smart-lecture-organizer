<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import Input from '$lib/components/ui/input/input.svelte';

	import Dialog from '$lib/components/ui/dialog/dialog.svelte';
	import DialogTrigger from '$lib/components/ui/dialog/dialog-trigger.svelte';
	import DialogContent from '$lib/components/ui/dialog/dialog-content.svelte';
	import DialogHeader from '$lib/components/ui/dialog/dialog-header.svelte';
	import DialogTitle from '$lib/components/ui/dialog/dialog-title.svelte';
	import DialogDescription from '$lib/components/ui/dialog/dialog-description.svelte';
	import DialogFooter from '$lib/components/ui/dialog/dialog-footer.svelte';

	let open = $state(false);
	let loading = $state(false);

	let formData = $state({
		name: '',
		description: ''
	});

	async function handleSubmit() {
		try {
			loading = true;

			const response = await fetch('/api/subjects', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(formData)
			});

			if (!response.ok) {
				throw new Error('Failed creating subject');
			}

			formData.name = '';
			formData.description = '';

			open = false;

			// refresh page data
			window.location.reload();
		} catch (error) {
			console.error(error);
			alert('Failed creating subject');
		} finally {
			loading = false;
		}
	}
</script>

<Dialog bind:open>
	<DialogTrigger>
		<Button variant="outline">
			<i class="ph ph-book"></i>
			New Subject
		</Button>
	</DialogTrigger>

	<DialogContent class="sm:max-w-lg">
		<DialogHeader>
			<DialogTitle>Create Subject</DialogTitle>

			<DialogDescription>Add a new course to your lecture organizer.</DialogDescription>
		</DialogHeader>

		<div class="space-y-4 py-4">
			<div class="flex flex-col gap-1">
				<label for="title" class="text-sm font-medium"> Subject Name </label>

				<Input id="title" bind:value={formData.name} placeholder="Example: Advanced Algorithms" />
			</div>

			<div class="flex flex-col gap-1">
				<label for="desc" class="text-sm font-medium"> Description </label>

				<textarea
					id="desc"
					bind:value={formData.description}
					placeholder="Brief description..."
					class="min-h-32 w-full rounded-lg border bg-background px-3 py-2 text-sm"
				></textarea>
			</div>
		</div>

		<DialogFooter>
			<Button variant="outline" onclick={() => (open = false)} disabled={loading}>Cancel</Button>

			<Button onclick={handleSubmit} disabled={!formData.name.trim() || loading}>
				{loading ? 'Creating...' : 'Create Subject'}
			</Button>
		</DialogFooter>
	</DialogContent>
</Dialog>
