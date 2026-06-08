<script lang="ts">
	import FormDialog from '$lib/components/FormDialog.svelte';
	import Badge from '$lib/components/ui/badge/badge.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import Card from '$lib/components/ui/card/card.svelte';
	import { CardTitle } from '$lib/components/ui/card/index.js';
	import Input from '$lib/components/ui/input/input.svelte';
	import Item from '$lib/components/ui/item/item.svelte';

	let { data } = $props();
</script>

<div class="flex min-h-dvh w-full flex-col bg-background lg:flex-row">
	<div class="w-full px-4 py-6 sm:px-6 md:px-8 lg:px-11">
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

			<Button type="button" class="w-full hover:bg-indigo-700 active:scale-97 sm:w-auto">
				<i class="ph-bold ph-plus text-lg"></i>
				<p class="text-sm">Add New</p>
			</Button>
		</div>

		<!-- Main Card -->
		<Button
			class="flex h-fit w-full flex-col items-start bg-linear-to-br from-primary via-indigo-600 to-violet-800 bg-size-[200%_200%] bg-position-[0%_0%] px-5 py-5 transition-all duration-500 ease-in-out hover:bg-position-[100%_100%] sm:px-8 sm:py-6"
		>
			<Badge class="bg-primaryLight/25">on going</Badge>
			<h4 class="mt-3 text-2xl sm:text-3xl lg:text-4xl">Advance Algorithms</h4>
			<span class="mb-4 text-gray-300">Dr. Aisha Rahmah</span>
		</Button>

		<!-- Slide Show -->
		<p class="mt-5 text-lg font-medium">continue</p>
		<div class="my-2 flex gap-4 overflow-x-auto pb-2">
			<Button
				variant="outline"
				class="flex h-fit min-w-65 flex-col items-start border border-primary p-6 ring-primary/10 transition-all duration-300 hover:bg-white/30 active:scale-98 active:ring-4"
			>
				<div class="flex w-full justify-between">
					<i class="ph-fill ph-sparkle rounded-xl bg-primary/10 p-2 text-2xl text-primary"></i>
					<Badge class="bg-primary/10 text-primary">on going</Badge>
				</div>
				<h4 class="mt-3 text-2xl leading-3">Advance Algorithms</h4>
				<span class="mb-4 text-xs text-innactive">Dr. Aisha Rahmah</span>
			</Button>
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
					<span>4</span>
				</Item>
				<Item variant="muted" class="w-full flex-nowrap justify-between rounded-xl bg-divider/25">
					<div class="flex items-center justify-center gap-3">
						<i class="ph-bold ph-book-open-text rounded-lg bg-primary/10 p-2"></i>
						<span class="text-nowrap">FIle Tersimpan</span>
					</div>
					<span>14</span>
				</Item>
			</div>
		</Card>
		<div class="fixed right-6 bottom-6">
			<FormDialog />
		</div>
	</div>
</div>
