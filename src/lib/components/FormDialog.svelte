<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';

	import Button from '$lib/components/ui/button/button.svelte';
	import Input from '$lib/components/ui/input/input.svelte';

	import { createUploader } from '$lib/utils/uploadthing';
	import { Uploader } from '@uploadthing/svelte';

	let open = $state(false);

	let uploadedMaterialId = $state<string | null>(null);

	let formData = $state({
		// Subject
		subjectName: '',
		subjectDescription: '',

		// Meeting
		meetingTitle: '',
		meetingDescription: '',
		weekNumber: 1,

		// Note
		noteTitle: '',
		noteContent: ''
	});

	const uploader = createUploader('materiUploader', {
		onClientUploadComplete: (res) => {
			if (!res?.length) return;

			uploadedMaterialId = res[0].serverData.materialId;
		},

		onUploadError: (error: Error) => {
			alert(error.message);
		}
	});

	async function handleSubmit() {
		try {
			/*
			 * SUBJECT
			 */
			if (formData.subjectName.trim()) {
				const response = await fetch('/api/subjects', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({
						name: formData.subjectName,
						description: formData.subjectDescription
					})
				});

				if (!response.ok) {
					throw new Error('Failed creating subject');
				}
			}

			/*
			 * MEETING
			 */
			if (formData.meetingTitle.trim()) {
				const response = await fetch('/api/meetings', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({
						title: formData.meetingTitle,
						description: formData.meetingDescription,
						weekNumber: formData.weekNumber,
						subjectId: null
					})
				});

				if (!response.ok) {
					throw new Error('Failed creating meeting');
				}
			}

			/*
			 * NOTE
			 */
			if (
				formData.noteTitle.trim() &&
				formData.noteContent.trim()
			) {
				const response = await fetch('/api/notes', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({
						title: formData.noteTitle,
						content: formData.noteContent,
						materialId: uploadedMaterialId
					})
				});

				if (!response.ok) {
					throw new Error('Failed creating note');
				}
			}

			resetForm();

			open = false;

			alert('Resources created successfully');
		} catch (error) {
			console.error(error);
			alert('Failed creating resources');
		}
	}

	function resetForm() {
		formData.subjectName = '';
		formData.subjectDescription = '';

		formData.meetingTitle = '';
		formData.meetingDescription = '';
		formData.weekNumber = 1;

		formData.noteTitle = '';
		formData.noteContent = '';

		uploadedMaterialId = null;
	}
</script>

<Dialog.Root bind:open>
	<Dialog.Trigger>
		<Button>
			+ Create
		</Button>
	</Dialog.Trigger>

	<Dialog.Content class="max-h-[90vh] overflow-y-auto sm:max-w-4xl p-0">
		<Dialog.Header class="sticky top-0 z-10 bg-white w-full px-8 pt-8 pb-4">
			<Dialog.Title class="text-2xl font-semibold">
				Quick Create
			</Dialog.Title>

			<Dialog.Description class="text-sm text-innactive">
				Create subject, meeting, upload material and notes.
			</Dialog.Description>
		</Dialog.Header>

		<div class="space-y-8 px-8">

			<!-- SUBJECT -->

			<section class="space-y-4">
				<div>
					<h3 class="text-lg font-semibold">
						Subject
					</h3>

					<p class="text-sm text-innactive">
						Basic information about your course.
					</p>
				</div>

				<Input
					bind:value={formData.subjectName}
					placeholder="Subject Name"
				/>

				<textarea
					bind:value={formData.subjectDescription}
					placeholder="Subject Description"
					class="min-h-28 w-full rounded-lg border bg-background px-3 py-2 text-sm"
				></textarea>
			</section>

			<!-- MEETING -->

			<section class="space-y-4">
				<div>
					<h3 class="text-lg font-semibold">
						Meeting
					</h3>

					<p class="text-sm text-innactive">
						Create a lecture meeting.
					</p>
				</div>

				<div class="grid gap-3 md:grid-cols-4">

					<div class="md:col-span-3">
						<Input
							bind:value={formData.meetingTitle}
							placeholder="Meeting Title"
						/>
					</div>

					<Input
						type="number"
						min="1"
						max="16"
						bind:value={formData.weekNumber}
						placeholder="Week"
					/>

				</div>

				<textarea
					bind:value={formData.meetingDescription}
					placeholder="Meeting Description"
					class="min-h-28 w-full rounded-lg border bg-background px-3 py-2 text-sm"
				></textarea>
			</section>

			<!-- MATERIAL -->

			<section class="space-y-4">
				<div>
					<h3 class="text-lg font-semibold">
						Material Upload
					</h3>

					<p class="text-sm text-innactive">
						Upload PDF, Image or Audio material.
					</p>
				</div>

				<div class="rounded-xl border p-4">
					<Uploader {uploader} />

					{#if uploadedMaterialId}
						<div
							class="mt-4 rounded-lg border border-green-500/30 bg-green-500/10 px-3 py-2 text-sm text-green-600"
						>
							✓ Material uploaded successfully
						</div>
					{/if}
				</div>
			</section>

			<!-- NOTE -->

			<section class="space-y-4">
				<div>
					<h3 class="text-lg font-semibold">
						Notes
					</h3>

					<p class="text-sm text-innactive">
						Add your lecture notes.
					</p>
				</div>

				<Input
					bind:value={formData.noteTitle}
					placeholder="Note Title"
				/>

				<textarea
					bind:value={formData.noteContent}
					placeholder="Write your notes..."
					class="min-h-48 w-full rounded-lg border bg-background px-3 py-2 text-sm"
				></textarea>
			</section>

		</div>

		<Dialog.Footer class="mx-4 mt-2 pb-6">
			<Button
				variant="outline"
				onclick={() => (open = false)}
			>
				Cancel
			</Button>

			<Button onclick={handleSubmit}>
				Create Resources
			</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>