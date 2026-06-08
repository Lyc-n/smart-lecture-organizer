<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { resolve } from '$app/paths';
	import Button from '$lib/components/ui/button/button.svelte';
	import Card from '$lib/components/ui/card/card.svelte';
	import { CardTitle } from '$lib/components/ui/card/index.js';
	import Item from '$lib/components/ui/item/item.svelte';
	import { formatRelativeTime } from '$lib/utils/format-relative-time';
	import { onMount } from 'svelte';
	import { Progress } from '$lib/components/ui/progress/index.js';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let value = $state(13);
	let deletingId = $state<string | null>(null);

	onMount(() => {
		const timer = setTimeout(() => (value = 50), 500);
		return () => clearTimeout(timer);
	});

	async function deleteNote(id: string) {
		deletingId = id;

		try {
			const response = await fetch(`/api/notes/${id}`, { method: 'DELETE' });
			if (response.ok) {
				await invalidateAll();
			}
		} finally {
			deletingId = null;
		}
	}
</script>

<div class="flex min-h-dvh w-full bg-background">
	<div class="w-full px-11 py-8">
		<!-- Header -->
		<div class="flex w-full items-center justify-between pb-7">
			<div class="">
				<h1 class="text-2xl leading-11 font-semibold">Categories</h1>
			</div>

			<Button type="button" class="hover:bg-blue-600 active:scale-97 ">
				<i class="ph-bold ph-plus text-lg"></i>
				<p class="text-sm">Add New</p>
			</Button>
		</div>

		<!-- Main Card -->
		<div class="grid grid-cols-[10fr_2fr_10fr] grid-rows-[1fr_1fr] gap-4 px-4">
			<Button
				variant="ghost"
				class="col-span-1 flex h-fit w-full flex-col items-start bg-primary p-6 ring-primary/10 transition-all duration-300 hover:bg-blue-600 active:scale-98 active:ring-4"
			>
				<div class="flex w-full justify-between">
					<i class="ph-fill ph-sparkle rounded-xl text-3xl text-background"></i>
				</div>
				<h4 class="mt-3 text-2xl leading-3 text-background">Advance Algorithms</h4>
				<span class="mt-4 text-xs text-gray-200">Dr. Aisha Rahmah</span>
			</Button>
			<Button
				variant="ghost"
				class="col-span-2 flex h-fit w-full flex-col items-start bg-primary p-6 ring-primary/10 transition-all duration-300 hover:bg-blue-600 active:scale-98 active:ring-4"
			>
				<div class="flex w-full justify-between">
					<i class="ph-fill ph-sparkle rounded-xl text-3xl text-background"></i>
				</div>
				<h4 class="mt-3 text-2xl leading-3 text-background">Advance Algorithms</h4>
				<span class="mt-4 text-xs text-gray-200">Dr. Aisha Rahmah</span>
			</Button>
			<Button
				variant="ghost"
				class="col-span-2 flex h-fit w-full flex-col items-start bg-primary p-6 ring-primary/10 transition-all duration-300 hover:bg-blue-600 active:scale-98 active:ring-4"
			>
				<div class="flex w-full justify-between">
					<i class="ph-fill ph-sparkle rounded-xl text-3xl text-background"></i>
				</div>
				<h4 class="mt-3 text-2xl leading-3 text-background">Advance Algorithms</h4>
				<span class="mt-4 text-xs text-gray-200">Dr. Aisha Rahmah</span>
			</Button>
			<Button
				variant="ghost"
				class="col-span-1 flex h-fit w-full flex-col items-start bg-primary p-6 ring-primary/10 transition-all duration-300 hover:bg-blue-600 active:scale-98 active:ring-4"
			>
				<div class="flex w-full justify-between">
					<i class="ph-fill ph-sparkle rounded-xl text-3xl text-background"></i>
				</div>
				<h4 class="mt-3 text-2xl leading-3 text-background">Advance Algorithms</h4>
				<span class="mt-4 text-xs text-gray-200">Dr. Aisha Rahmah</span>
			</Button>
		</div>

		<!-- Recent Saved -->
		<p class="mt-5 text-lg">Recent Saved</p>
		<div class="my-2 flex flex-col gap-3 px-4">
			{#if data.notes.length === 0}
				<Item variant="muted" class="justify-center border-dashed py-8">
					<p class="text-sm text-innactive">No notes yet. Create one from the home page.</p>
				</Item>
			{:else}
				{#each data.notes as note (note.id)}
					<Item variant="muted" class="justify-between border-warning">
						<div class="flex min-w-0 items-center gap-3">
							<i class="ph-bold ph-note-pencil shrink-0 rounded-xl bg-warning/10 p-2 text-2xl text-warning"></i>
							<div class="min-w-0">
								<p class="truncate text-sm leading-5 font-medium">{note.title}</p>
								<span class="text-xs text-innactive">
									{note.subjectName} · MD · {formatRelativeTime(note.updatedAt)}
								</span>
							</div>
						</div>
						<div class="flex shrink-0 gap-2">
							<Button
								class="bg-transparent p-2 hover:bg-divider/25"
								href={resolve(`/app/notes/${note.id}`)}
							>
								<i class="ph-bold ph-pencil-simple-line text-xl text-innactive"></i>
							</Button>
							<Button
								class="bg-transparent p-2 hover:bg-divider/25"
								disabled={deletingId === note.id}
								onclick={() => deleteNote(note.id)}
							>
								<i class="ph-bold ph-trash-simple text-xl text-innactive"></i>
							</Button>
						</div>
					</Item>
				{/each}
			{/if}
		</div>
	</div>
	<div class="w-fit py-6 ps-3 pe-6">
		<Card class="flex w-68 min-w-fit cursor-default gap-4 p-7">
			<CardTitle class="flex items-center text-xs tracking-wider"
				><i class="ph-bold ph-cloud-check me-2 text-lg text-primary"></i>Storage Usage</CardTitle
			>
			<div class="flex w-full flex-col gap-1">
				<div class="flex items-center justify-between gap-3">
					<span class="text-xs text-nowrap text-innactive/70">Used 1 GB of 2 GB</span>
					<span class="text-sm font-semibold text-primary">50%</span>
				</div>
				<Progress {value} max={100} class="max-h-1.5" />
			</div>
		</Card>
	</div>
</div>
