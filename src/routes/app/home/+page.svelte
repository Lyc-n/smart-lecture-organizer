<script>
	import Badge from '$lib/components/ui/badge/badge.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import { ResizablePane } from '$lib/components/ui/resizable';
	import ResizableHandle from '$lib/components/ui/resizable/resizable-handle.svelte';
	import ResizablePaneGroup from '$lib/components/ui/resizable/resizable-pane-group.svelte';
</script>

<!-- {#snippet iconMataKuliah()}
	<i class="ph-bold ph-book-open-text rounded-lg bg-innactive/10 px-3 py-2.5 text-xl"></i>
{/snippet}

{#snippet iconFile()}
	<i class="ph-bold ph-file-text rounded-lg bg-innactive/10 px-3 py-2.5 text-xl"></i>
{/snippet} -->

<!-- {#snippet iconPDF()}
	<i class="ph-bold ph-file-pdf text-xl px-3 py-2.5 rounded-lg bg-innactive/10"></i>
{/snippet}

{#snippet iconIMG()}
	<i class="ph-bold ph-image-square text-xl px-3 py-2.5 rounded-lg bg-innactive/10"></i>
{/snippet}

{#snippet iconTXT()}
	<i class="ph-bold ph-file-text text-xl px-3 py-2.5 rounded-lg bg-innactive/10"></i>
{/snippet} -->

<div class="min-h-dvh w-full bg-background px-11 py-8">
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
	<div class="flex w-full items-center justify-between py-10">
		<div class="">
			<h1 class="text-4xl leading-12 font-medium">Hai Bro..</h1>
			<h3 class="font-lg font-medium text-innactive">Ready ???</h3>
		</div>

		<Button type="button" class="hover:bg-indigo-700 active:scale-97">
			<i class="ph-bold ph-plus text-lg"></i>
			<p class="text-sm">Add New</p>
		</Button>
	</div>

	<!-- Main Card -->
	<Button
		class="flex h-fit w-fit flex-col items-start bg-linear-to-br from-primary to-indigo-800 px-8 py-6"
	>
		<Badge class="bg-primaryLight/25">on going</Badge>
		<h4 class="mt-3 text-4xl">Advance Algorithms</h4>
		<span class="mb-4 text-gray-300">Dr. Aisha Rahmah</span>
	</Button>

	<!-- Slide Show -->
	<ResizablePaneGroup direction="horizontal">
		<ResizablePane>
			<Button
				variant="outline"
				class="flex h-fit w-fit flex-col items-start border border-primary px-8 py-6 hover:bg-white/30 active:scale-98 transition-all duration-300 active:ring-4 ring-primary/10"
			>
				<div class="flex w-full justify-between">
					<i class="ph-fill ph-sparkle rounded-xl bg-primary/10 p-2 text-2xl text-primary"></i>
					<Badge class="bg-primary/10 text-primary">on going</Badge>
				</div>
				<h4 class="mt-3 text-2xl leading-3">Advance Algorithms</h4>
				<span class="mb-4 text-xs text-innactive">Dr. Aisha Rahmah</span>
			</Button>
		</ResizablePane>
		<ResizableHandle />
		<ResizablePane></ResizablePane>
	</ResizablePaneGroup>
</div>
