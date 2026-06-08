<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import Card from '$lib/components/ui/card/card.svelte';
	import { CardTitle } from '$lib/components/ui/card/index.js';
	import { onMount } from 'svelte';
	import { Progress } from '$lib/components/ui/progress/index.js';
	import Item from '$lib/components/ui/item/item.svelte';

	let value = $state(13);

	onMount(() => {
		const timer = setTimeout(() => (value = 50), 500);
		return () => clearTimeout(timer);
	});

	// let { data } = $props();
</script>

<div class="flex min-h-dvh w-full flex-col bg-background lg:flex-row">
	<div class="w-full px-4 py-6 sm:px-6 md:px-8 lg:px-11 lg:py-8">
		<!-- Header -->
		<div class="flex flex-col gap-4 pb-6 sm:flex-row sm:items-center sm:justify-between sm:pb-7">
			<div>
				<h1 class="text-xl font-semibold sm:text-2xl">Categories</h1>
			</div>

			<Button type="button" class="w-full hover:bg-blue-600 active:scale-97 sm:w-auto">
				<i class="ph-bold ph-plus text-lg"></i>
				<p class="text-sm">Add New</p>
			</Button>
		</div>

		<!-- Main Card -->
		<div
			class="
				grid auto-rows-auto grid-cols-1 gap-4 px-0

				sm:px-2
				md:grid-cols-2
				lg:grid-cols-[10fr_2fr_10fr]

				lg:grid-rows-[1fr_1fr]
				lg:px-4
			"
		>
			<Button
				variant="ghost"
				class="
					col-span-1
					flex h-fit w-full flex-col items-start
					bg-primary p-5 ring-primary/10
					transition-all
					duration-300 hover:bg-blue-600
					active:scale-98
					active:ring-4 sm:p-6
				"
			>
				<div class="flex w-full justify-between">
					<i class="ph-fill ph-sparkle rounded-xl text-2xl text-background sm:text-3xl"></i>
				</div>

				<h4 class="mt-3 text-xl text-background sm:text-2xl">Advance Algorithms</h4>

				<span class="mt-4 text-xs text-gray-200"> Dr. Aisha Rahmah </span>
			</Button>

			<Button
				variant="ghost"
				class="
					col-span-1
					flex
					h-fit w-full flex-col items-start bg-primary
					p-5 ring-primary/10 transition-all
					duration-300
					hover:bg-blue-600 active:scale-98
					active:ring-4
					sm:p-6 lg:col-span-2
				"
			>
				<div class="flex w-full justify-between">
					<i class="ph-fill ph-sparkle rounded-xl text-2xl text-background sm:text-3xl"></i>
				</div>

				<h4 class="mt-3 text-xl text-background sm:text-2xl">Advance Algorithms</h4>

				<span class="mt-4 text-xs text-gray-200"> Dr. Aisha Rahmah </span>
			</Button>

			<Button
				variant="ghost"
				class="
					col-span-1
					flex
					h-fit w-full flex-col items-start bg-primary
					p-5 ring-primary/10 transition-all
					duration-300
					hover:bg-blue-600 active:scale-98
					active:ring-4
					sm:p-6 lg:col-span-2
				"
			>
				<div class="flex w-full justify-between">
					<i class="ph-fill ph-sparkle rounded-xl text-2xl text-background sm:text-3xl"></i>
				</div>

				<h4 class="mt-3 text-xl text-background sm:text-2xl">Advance Algorithms</h4>

				<span class="mt-4 text-xs text-gray-200"> Dr. Aisha Rahmah </span>
			</Button>

			<Button
				variant="ghost"
				class="
					col-span-1
					flex h-fit w-full flex-col items-start
					bg-primary p-5 ring-primary/10
					transition-all
					duration-300 hover:bg-blue-600
					active:scale-98
					active:ring-4 sm:p-6
				"
			>
				<div class="flex w-full justify-between">
					<i class="ph-fill ph-sparkle rounded-xl text-2xl text-background sm:text-3xl"></i>
				</div>

				<h4 class="mt-3 text-xl text-background sm:text-2xl">Advance Algorithms</h4>

				<span class="mt-4 text-xs text-gray-200"> Dr. Aisha Rahmah </span>
			</Button>
		</div>

		<!-- Recent Saved -->
		<p class="mt-5 text-base sm:text-lg">Recent Saved</p>

		<div class="my-2 overflow-x-auto px-0 sm:px-2 lg:px-4">
			<div class="flex min-w-max gap-4">
				<Item variant="muted" class="min-w-[320px] justify-between border-warning sm:min-w-[500px]">
					<div class="flex items-center gap-3">
						<i
							class="ph-bold ph-file-text rounded-xl bg-warning/10 p-2 text-xl text-warning sm:text-2xl"
						></i>

						<div class="h-fit">
							<p class="text-sm leading-4 font-medium">Contract Belajar</p>

							<span class="text-xs text-innactive"> TXT | 2 hours ago </span>
						</div>
					</div>

					<div class="flex gap-1 sm:gap-2 md:gap-4">
						<Button class="bg-transparent p-2 hover:bg-divider/25">
							<i class="ph-bold ph-pencil-simple-line text-lg text-innactive sm:text-xl"></i>
						</Button>

						<Button class="bg-transparent p-2 hover:bg-divider/25">
							<i class="ph-bold ph-trash-simple text-lg text-innactive sm:text-xl"></i>
						</Button>

						<Button class="bg-transparent p-2 hover:bg-divider/25">
							<i class="ph-bold ph-bookmark-simple text-lg text-innactive sm:text-xl"></i>
						</Button>
					</div>
				</Item>
			</div>
		</div>
	</div>

	<!-- Storage -->
	<div
		class="
			w-full
			px-4 pb-6
			sm:px-6
			md:px-8
			lg:w-fit
			lg:py-6
			lg:ps-3
			lg:pe-6
		"
	>
		<Card
			class="
				flex w-full
				cursor-default gap-4
				p-5 sm:p-6 lg:w-68
			"
		>
			<CardTitle class="flex items-center text-xs tracking-wider">
				<i class="ph-bold ph-cloud-check me-2 text-lg text-primary"></i>
				Storage Usage
			</CardTitle>

			<div class="flex w-full flex-col gap-1">
				<div class="flex items-center justify-between gap-3">
					<span class="text-xs text-innactive/70"> Used 1 GB of 2 GB </span>

					<span class="text-sm font-semibold text-primary"> 50% </span>
				</div>

				<Progress {value} max={100} class="max-h-1.5" />
			</div>
		</Card>
	</div>
</div>
