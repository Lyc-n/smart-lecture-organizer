<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import MarkdownEditor from '$lib/components/markdown-editor.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let title = $state(data.note.title);
	let content = $state(data.note.content);
	let subjectId = $state(data.note.subjectId ?? data.subjects[0]?.id ?? '');
	let saving = $state(false);
	let saveMessage = $state('');
	let errorMessage = $state('');

	async function saveNote() {
		if (!subjectId) {
			errorMessage = 'Please select a subject.';
			return;
		}

		saving = true;
		errorMessage = '';
		saveMessage = '';

		try {
			const response = await fetch(`/api/notes/${data.note.id}`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					title: title.trim() || 'Untitled',
					content,
					subjectId
				})
			});

			if (!response.ok) {
				const result = await response.json().catch(() => null);
				errorMessage = result?.message ?? 'Failed to save note.';
				return;
			}

			saveMessage = 'Saved';
			setTimeout(() => {
				saveMessage = '';
			}, 2000);
		} catch {
			errorMessage = 'Failed to save note.';
		} finally {
			saving = false;
		}
	}

	function handleKeydown(event: KeyboardEvent) {
		if ((event.metaKey || event.ctrlKey) && event.key === 's') {
			event.preventDefault();
			saveNote();
		}
	}
</script>

<svelte:window onkeydown={handleKeydown} />

<div class="flex min-h-dvh flex-col bg-background">
	<header class="flex shrink-0 items-center justify-between border-b border-divider/40 px-8 py-4">
		<div class="flex items-center gap-3">
			<Button variant="ghost" size="icon-sm" onclick={() => goto(resolve('/app/home'))}>
				<i class="ph ph-arrow-left text-lg"></i>
				<span class="sr-only">Back to home</span>
			</Button>
			<div>
				<h1 class="text-lg font-semibold">Note Editor</h1>
				<p class="text-xs text-muted-foreground">Live markdown · Ctrl+S to save</p>
			</div>
		</div>

		<div class="flex items-center gap-3">
			{#if saveMessage}
				<span class="text-sm text-primary">{saveMessage}</span>
			{/if}
			{#if errorMessage}
				<span class="text-sm text-destructive">{errorMessage}</span>
			{/if}
			<Button type="button" onclick={saveNote} disabled={saving || data.subjects.length === 0}>
				{saving ? 'Saving...' : 'Save'}
			</Button>
		</div>
	</header>

	<div class="flex min-h-[calc(100dvh-5rem)] flex-1 flex-col gap-6 overflow-hidden px-8 py-6">
		<div class="grid shrink-0 gap-4 md:grid-cols-[1fr_240px]">
			<div class="space-y-2">
				<Label for="note-title">Title</Label>
				<Input
					id="note-title"
					bind:value={title}
					placeholder="Note title"
					class="border-0 bg-white px-4 py-3 text-2xl font-semibold shadow-[0_0_1px_1px_rgba(0,0,0,0.08)]"
				/>
			</div>

			<div class="space-y-2">
				<Label for="note-subject">Subject</Label>
				{#if data.subjects.length > 0}
					<select
						id="note-subject"
						bind:value={subjectId}
						class="h-11 w-full rounded-3xl border border-transparent bg-input/50 px-4 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30"
					>
						{#each data.subjects as subject (subject.id)}
							<option value={subject.id}>{subject.name}</option>
						{/each}
					</select>
				{:else}
					<p class="text-sm text-muted-foreground">No subjects available.</p>
				{/if}
			</div>
		</div>

		<div class="flex min-h-0 flex-1 flex-col space-y-2">
			<Label>Content</Label>
			<MarkdownEditor bind:value={content} placeholder="Write in Markdown — headings, **bold**, *italic*, lists, and more format as you type." />
		</div>
	</div>
</div>
