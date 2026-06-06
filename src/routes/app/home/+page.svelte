<script lang="ts">
	import Badge from '$lib/components/ui/badge/badge.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import Card from '$lib/components/ui/card/card.svelte';
	import { CardTitle } from '$lib/components/ui/card/index.js';
	import Input from '$lib/components/ui/input/input.svelte';
	import Item from '$lib/components/ui/item/item.svelte';

	let { data } = $props();

</script>

<div class="min-h-dvh w-full bg-background flex">
	<div class="w-full px-11 py-8">
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
		<div class="flex w-full items-center justify-between pt-10 pb-7">
			<div class="">
				<h1 class="text-4xl leading-11 font-semibold">Hai {data.user?.name}</h1>
				<h3 class="font-lg text-innactive">Ready to Organize your Lecture???</h3>
			</div>

			<Button type="button" class="hover:bg-indigo-700 active:scale-97 ">
				<i class="ph-bold ph-plus text-lg"></i>
				<p class="text-sm">Add New</p>
			</Button>
		</div>

		<!-- Main Card -->
		<Button
			class="flex h-fit w-full flex-col items-start bg-linear-to-br from-primary via-indigo-600 to-violet-800 bg-size-[200%_200%] bg-position-[0%_0%] hover:bg-position-[100%_100%] px-8 py-6 transition-all duration-500 ease-in-out"
		>
			<Badge class="bg-primaryLight/25">on going</Badge>
			<h4 class="mt-3 text-4xl">Advance Algorithms</h4>
			<span class="mb-4 text-gray-300">Dr. Aisha Rahmah</span>
		</Button>

		<!-- Slide Show -->
		<p class="font-medium text-lg mt-5">continue</p>
		<div class="flex gap-4 my-2 overscroll-x-auto">
			<Button
				variant="outline"
				class="flex h-fit w-fit flex-col items-start border border-primary p-6 hover:bg-white/30 active:scale-98 transition-all duration-300 active:ring-4 ring-primary/10"
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
	<div class="w-fit py-6 pe-6 ps-3">
		<Card class="p-6 gap-4 w-fit cursor-default">
			<CardTitle class="tracking-wider font-semibold">Activity Summary</CardTitle>
			<div class="space-y-2">
				<Item variant="muted" class="bg-divider/25 rounded-xl justify-between flex-nowrap w-full">
					<div class="flex justify-center items-center gap-3">
						<i class="ph-bold ph-book-open-text p-2 bg-primary/10 rounded-lg"></i>
						<span class="text-nowrap">Total Mata Kuliah</span>
					</div>
					<span>4</span>
				</Item>
				<Item variant="muted" class="bg-divider/25 rounded-xl justify-between flex-nowrap w-full">
					<div class="flex justify-center items-center gap-3">
						<i class="ph-bold ph-book-open-text p-2 bg-primary/10 rounded-lg"></i>
						<span class="text-nowrap">FIle Tersimpan</span>
					</div>
					<span>14</span>
				</Item>
			</div>
		</Card>
	</div>
</div>
