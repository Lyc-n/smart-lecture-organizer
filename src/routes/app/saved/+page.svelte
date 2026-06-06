<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import Card from '$lib/components/ui/card/card.svelte';
	import { CardTitle } from '$lib/components/ui/card/index.js';
    import { onMount } from "svelte";
    import { Progress } from "$lib/components/ui/progress/index.js";
	import Item from '$lib/components/ui/item/item.svelte';
    
    let value = $state(13);
    
    onMount(() => {
        const timer = setTimeout(() => (value = 50), 500);
        return () => clearTimeout(timer);
    });

	// let { data } = $props();

</script>

<div class="min-h-dvh w-full bg-background flex">
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
				class="flex h-fit w-full col-span-1 flex-col items-start bg-primary p-6 active:scale-98 transition-all duration-300 active:ring-4 ring-primary/10 hover:bg-blue-600"
			>
				<div class="flex w-full justify-between">
					<i class="ph-fill ph-sparkle rounded-xl text-3xl text-background"></i>
				</div>
				<h4 class="mt-3 text-2xl leading-3 text-background">Advance Algorithms</h4>
				<span class="mt-4 text-xs text-gray-200">Dr. Aisha Rahmah</span>
			</Button>
			<Button
				variant="ghost"
				class="flex h-fit w-full col-span-2 flex-col items-start bg-primary p-6 active:scale-98 transition-all duration-300 active:ring-4 ring-primary/10 hover:bg-blue-600"
			>
				<div class="flex w-full justify-between">
					<i class="ph-fill ph-sparkle rounded-xl text-3xl text-background"></i>
				</div>
				<h4 class="mt-3 text-2xl leading-3 text-background">Advance Algorithms</h4>
				<span class="mt-4 text-xs text-gray-200">Dr. Aisha Rahmah</span>
			</Button>
			<Button
				variant="ghost"
				class="flex h-fit w-full col-span-2 flex-col items-start bg-primary p-6 active:scale-98 transition-all duration-300 active:ring-4 ring-primary/10 hover:bg-blue-600"
			>
				<div class="flex w-full justify-between">
					<i class="ph-fill ph-sparkle rounded-xl text-3xl text-background"></i>
				</div>
				<h4 class="mt-3 text-2xl leading-3 text-background">Advance Algorithms</h4>
				<span class="mt-4 text-xs text-gray-200">Dr. Aisha Rahmah</span>
			</Button>
			<Button
				variant="ghost"
				class="flex h-fit w-full col-span-1 flex-col items-start bg-primary p-6 active:scale-98 transition-all duration-300 active:ring-4 ring-primary/10 hover:bg-blue-600"
			>
				<div class="flex w-full justify-between">
					<i class="ph-fill ph-sparkle rounded-xl text-3xl text-background"></i>
				</div>
				<h4 class="mt-3 text-2xl leading-3 text-background">Advance Algorithms</h4>
				<span class="mt-4 text-xs text-gray-200">Dr. Aisha Rahmah</span>
			</Button>
        </div>

		<!-- Slide Show -->
		<p class="text-lg mt-5">Recent Saved</p>
		<div class="flex gap-4 my-2 overscroll-x-auto px-4">
			<Item variant="muted" class="border-warning justify-between">
                <div class="flex gap-3 items-center">
                    <i class="ph-bold ph-file-text text-2xl text-warning p-2 rounded-xl bg-warning/10"></i>
                    <div class="h-fit">
                        <p class="text-sm font-medium leading-3">Contract Belajar</p>
                        <span class="text-innactive text-xs">TXT | 2 hours ago</span>
                    </div>
                </div>
                <div class="flex gap-4">
                    <Button class="p-2 bg-transparent hover:bg-divider/25"><i class="ph-bold ph-pencil-simple-line text-xl text-innactive"></i></Button>
                    <Button class="p-2 bg-transparent hover:bg-divider/25"><i class="ph-bold ph-trash-simple text-xl text-innactive"></i></Button>
                    <Button class="p-2 bg-transparent hover:bg-divider/25"><i class="ph-bold ph-bookmark-simple text-xl text-innactive"></i></Button>
                </div>
                </Item>
		</div>
	</div>
	<div class="w-fit py-6 pe-6 ps-3">
		<Card class="flex p-7 gap-4 min-w-fit cursor-default w-68">
			<CardTitle class="tracking-wider text-xs flex items-center"><i class="ph-bold text-primary ph-cloud-check me-2 text-lg"></i>Storage Usage</CardTitle>
			<div class="flex-col w-full flex gap-1">
				<div class="flex justify-between items-center gap-3">
					<span class="text-xs text-innactive/70 text-nowrap">Used 1 GB of 2 GB</span>
					<span class="text-primary font-semibold text-sm">50%</span>
				</div>
				<Progress {value} max={100} class="max-h-1.5"/>
			</div>
		</Card>
	</div>
</div>
