<script lang="ts">
	import MaterialForm from '$lib/components/form/MaterialForm.svelte';
	import MeetingForm from '$lib/components/form/MeetingForm.svelte';
	import NoteForm from '$lib/components/form/NoteForm.svelte';
	import SubjectForm from '$lib/components/form/SubjectForm.svelte';

	import Button from '$lib/components/ui/button/button.svelte';
	import Card from '$lib/components/ui/card/card.svelte';

	type ResourceType = 'subject' | 'meeting' | 'material' | 'note';

	let type = $state<ResourceType>('subject');

	let formData = $state({
		name: '',
		description: '',

		title: '',
		content: '',

		weekNumber: 1,

		subjectId: '',
		meetingId: '',
		materialId: ''
	});

	const endpoints = {
		subject: '/api/subjects',
		meeting: '/api/meetings',
		material: '/api/materials',
		note: '/api/notes'
	};

	async function handleSubmit() {
		let payload;

		switch (type) {
			case 'subject':
				payload = {
					name: formData.name,
					description: formData.description
				};
				break;

			case 'meeting':
				payload = {
					subjectId: formData.subjectId || null,
					weekNumber: formData.weekNumber,
					title: formData.title,
					description: formData.description
				};
				break;

			case 'material':
				payload = {
					title: formData.title,
					description: formData.description,

					subjectId: null,
					meetingId: null,

					fileName: 'dummy.pdf',
					mimeType: 'application/pdf',
					fileSize: 1000,

					fileKey: 'dummy-key',
					fileUrl: 'https://example.com/file.pdf'
				};
				break;

			case 'note':
				payload = {
					materialId: formData.materialId || null,
					title: formData.title,
					content: formData.content
				};
				break;
		}

		const response = await fetch(endpoints[type], {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(payload)
		});

		if (!response.ok) {
			throw new Error('Request failed');
		}

		resetForm();
	}

	function resetForm() {
		formData.name = '';
		formData.description = '';

		formData.title = '';
		formData.content = '';

		formData.weekNumber = 1;

		formData.subjectId = '';
		formData.meetingId = '';
		formData.materialId = '';
	}
</script>

<div class="mx-auto flex w-full max-w-5xl flex-col gap-6 p-6">
	<div>
		<h1 class="text-3xl font-bold">Quick Create</h1>

		<p class="mt-2 text-muted-foreground">
			Create subjects, meetings, materials and notes from one place.
		</p>
	</div>

	<div class="grid grid-cols-2 gap-4 md:grid-cols-4">
		<button
			type="button"
			onclick={() => (type = 'subject')}
			class={`rounded-xl border p-4 transition-all ${
				type === 'subject' ? 'border-primary bg-primary/10' : 'hover:bg-muted'
			}`}
		>
			<div class="text-2xl">📚</div>
			<div class="mt-2 font-medium">Subject</div>
		</button>

		<button
			type="button"
			onclick={() => (type = 'meeting')}
			class={`rounded-xl border p-4 transition-all ${
				type === 'meeting' ? 'border-primary bg-primary/10' : 'hover:bg-muted'
			}`}
		>
			<div class="text-2xl">🗓️</div>
			<div class="mt-2 font-medium">Meeting</div>
		</button>

		<button
			type="button"
			onclick={() => (type = 'material')}
			class={`rounded-xl border p-4 transition-all ${
				type === 'material' ? 'border-primary bg-primary/10' : 'hover:bg-muted'
			}`}
		>
			<div class="text-2xl">📄</div>
			<div class="mt-2 font-medium">Material</div>
		</button>

		<button
			type="button"
			onclick={() => (type = 'note')}
			class={`rounded-xl border p-4 transition-all ${
				type === 'note' ? 'border-primary bg-primary/10' : 'hover:bg-muted'
			}`}
		>
			<div class="text-2xl">📝</div>
			<div class="mt-2 font-medium">Note</div>
		</button>
	</div>

	<Card class="p-6">
		<div class="mb-6">
			<h2 class="text-xl font-semibold capitalize">
				Create {type}
			</h2>

			<p class="mt-1 text-sm text-muted-foreground">Fill in the information below.</p>
		</div>

		{#if type === 'subject'}
			<SubjectForm bind:data={formData} />
		{:else if type === 'meeting'}
			<MeetingForm bind:data={formData} />
		{:else if type === 'material'}
			<MaterialForm bind:data={formData} />
		{:else if type === 'note'}
			<NoteForm bind:data={formData} />
		{/if}

		<div class="mt-8 flex justify-end">
			<Button onclick={handleSubmit}>
				Create {type}
			</Button>
		</div>
	</Card>
</div>
