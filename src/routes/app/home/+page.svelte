<script lang="ts">
	import Fab from './../../../lib/components/fab.svelte';
	// import { enhance } from '$app/forms';
	import Badge from '$lib/components/ui/badge/badge.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import Card from '$lib/components/ui/card/card.svelte';
	import { CardTitle } from '$lib/components/ui/card/index.js';
	import Input from '$lib/components/ui/input/input.svelte';
	import Item from '$lib/components/ui/item/item.svelte';
	import { createUploader } from '$lib/utils/uploadthing.js';
	import { UploadButton } from '@uploadthing/svelte';
	import DatePicker from '$lib/components/date-picker.svelte';

	let { data, form } = $props();
	// let creating = $state(false);

	let latestSubjects = $derived(data.subjects[0]);
	let continueSubjects = $derived(data.subjects.slice(1));
	// const date = latestSubjects.createdAt
	// 	? new Date(latestSubjects.createdAt).toLocaleDateString('id-ID', {
	// 			day: 'numeric',
	// 			month: 'long',
	// 			year: 'numeric'
	// 	})
	// 	: '-';
	const date = 'ongoing'

	const uploader = createUploader('materiUploader', {
		onClientUploadComplete: (res) => {
			console.log(`onClientUploadComplete`, res);
			alert('Upload Completed');
		},
		onUploadError: (error: Error) => {
			alert(`ERROR! ${error.message}`);
		}
	});
</script>

<div class="flex min-h-dvh w-full flex-col bg-background lg:flex-row">
	<div class="w-full overflow-hidden px-4 py-6 sm:px-6 md:px-8 lg:px-11">
		<!-- Search Input -->
		<form action="">
			<div class="relative w-full">
				<Input
					type="text"
					placeholder="search"
					class="bg-white px-6 py-5 shadow-[0_0_1px_1px_rgba(0,0,0,0.1)]"
				/>
				<i class="ph ph-magnifying-glass absolute -translate-x-9 translate-y-3 text-innactive"></i>
			</div>
		</form>

		<!-- Header -->
		<div
			class="flex w-full flex-col gap-4 pt-8 pb-6 sm:flex-row sm:items-center sm:justify-between"
		>
			<div class="">
				<h1 class="text-2xl font-semibold sm:text-3xl lg:text-4xl">Hai {data.user?.name}</h1>
				<h3 class="text-sm text-innactive sm:text-base">Ready to Organize your Lecture???</h3>
			</div>

			<div class="flex items-center gap-3">
				<!-- <form
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
						<i class="ph-bold ph-note-pencil text-lg"></i>
						<p class="text-sm">{creating ? 'Creating...' : 'Create Note'}</p>
					</Button>
				</form> -->
				{#if form?.message}
					<p class="text-sm text-destructive">{form.message}</p>
				{/if}
				<UploadButton {uploader}>
					<span slot="button-content" let:state>
						{state.isUploading ? 'Uploading...' : 'Add New'}
					</span>
					<span slot="clear-btn"> Clear uploads </span>
					<span slot="allowed-content"> </span>
				</UploadButton>
			</div>
		</div>

		<!-- Main Card -->
		{#if latestSubjects}
			<Button
				class="flex h-fit w-full flex-col items-start bg-linear-to-br from-primary via-indigo-600 to-violet-800 bg-size-[200%_200%] bg-position-[0%_0%] px-5 py-5 transition-all duration-500 ease-in-out hover:bg-position-[100%_100%] sm:px-8 sm:py-6"
			>
				<Badge class="bg-primaryLight/25">
					{date}
				</Badge>

				<h4 class="mt-3 text-2xl sm:text-3xl lg:text-4xl">
					{latestSubjects.name}
				</h4>

				<span class="mb-4 text-gray-300">
					{latestSubjects.description}
				</span>
			</Button>
		{:else}
			<Card class="p-6">Belum ada materi.</Card>
		{/if}

		<!-- Slide Show -->
		<p class="mt-5 text-lg font-medium">continue</p>
		<div class="my-2 flex gap-4 overflow-x-auto pb-2">
			{#each continueSubjects as subjects (subjects.id)}
				<Button
					variant="outline"
					class="flex h-fit min-w-md flex-col items-start border border-primary p-6"
				>
					<div class="flex w-full justify-between">
						<i class="ph-fill ph-file rounded-xl bg-primary/10 p-2 text-2xl text-primary"></i>

						<Badge class="bg-primary/10 text-primary">
							{date}
						</Badge>
					</div>

					<h4 class="mt-3 text-2xl">
						{subjects.name}
					</h4>

					<span class="mb-4 text-xs text-innactive">
						{subjects.description ?? 'No desc'}
					</span>
				</Button>
			{/each}
		</div>
		<div class="flex">
			<DatePicker />
		</div>
	</div>
	<div class="w-full px-4 pb-6 sm:px-6 md:px-8 lg:w-fit lg:py-6 lg:ps-3 lg:pe-6">
		<Card class="w-full cursor-default gap-4 p-4 sm:p-6 lg:w-fit">
			<CardTitle class="font-semibold tracking-wider">Activity Summary</CardTitle>
			<div class="space-y-2">
				<Item variant="muted" class="w-full flex-nowrap justify-between rounded-xl bg-divider/25">
					<div class="flex items-center justify-center gap-3">
						<i class="ph-bold ph-book-open-text rounded-lg bg-primary/10 p-2"></i>
						<span class="truncate">Total Mata Kuliah</span>
					</div>
					<span>{data.totalSubject}</span>
				</Item>
				<Item variant="muted" class="w-full flex-nowrap justify-between rounded-xl bg-divider/25">
					<div class="flex items-center justify-center gap-3">
						<i class="ph-bold ph-book-open-text rounded-lg bg-primary/10 p-2"></i>
						<span class="text-nowrap">FIle Tersimpan</span>
					</div>
					<span>{data.totalFileUpload}</span>
				</Item>
			</div>
		</Card>
		<div class="fixed right-6 bottom-6">
			<!-- <FormDialog /> -->
			<Fab />
		</div>
	</div>
</div>
