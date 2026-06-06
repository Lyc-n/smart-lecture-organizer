<script>
	import MainCard from '$lib/components/MainCard.svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import SummaryCard from '$lib/components/SummaryCard.svelte';
	import VarCard from '$lib/components/VarCard.svelte';
</script>

{#snippet iconMataKuliah()}
	<i class="ph-bold ph-book-open-text rounded-lg bg-innactive/10 px-3 py-2.5 text-xl"></i>
{/snippet}

{#snippet iconFile()}
	<i class="ph-bold ph-file-text rounded-lg bg-innactive/10 px-3 py-2.5 text-xl"></i>
{/snippet}

<!-- {#snippet iconPDF()}
	<i class="ph-bold ph-file-pdf text-xl px-3 py-2.5 rounded-lg bg-innactive/10"></i>
{/snippet}

{#snippet iconIMG()}
	<i class="ph-bold ph-image-square text-xl px-3 py-2.5 rounded-lg bg-innactive/10"></i>
{/snippet}

{#snippet iconTXT()}
	<i class="ph-bold ph-file-text text-xl px-3 py-2.5 rounded-lg bg-innactive/10"></i>
{/snippet} -->

<div class="flex min-h-dvh min-w-dvh">
	<Sidebar />
	<div class="w-full bg-background px-11 py-8">
		<!-- Search Input -->
		<form action="">
			<div class="relative w-full">
				<input type="text" placeholder="search" class="w-full rounded-2xl px-4 text-sm" />
				<i class="ph ph-magnifying-glass absolute -translate-x-9 translate-y-2.5 text-innactive"
				></i>
			</div>
		</form>

		<!-- Header -->
		<div class="flex w-full items-center justify-between py-10">
			<div class="">
				<h1 class="text-5xl leading-12 font-medium">Hai Bro..</h1>
				<h3 class="font-lg font-medium text-innactive">Ready ???</h3>
			</div>

			<button
				type="button"
				class="flex h-fit w-fit items-center justify-center gap-3 rounded-2xl bg-primary px-4 py-2 text-white transition-all duration-200 active:scale-95"
			>
				<i class="ph-bold ph-plus text-lg"></i>
				<p class="text-sm">Add New</p>
			</button>
		</div>

		<!-- Main Card -->
		<MainCard />

		<!-- Slide Show -->
		<div class="flex flex-col gap-4">
			<h4 class="font-semibold">Continue</h4>
			<div class="flex gap-3">
				<VarCard />
				<VarCard />
				<!-- <VarCard/> -->
			</div>
		</div>

		<!-- Weekly -->
		<div class="flex">
			<!-- Calendar -->
			<div class=""></div>

			<!-- Weekly Meet -->
			<div class=""></div>
		</div>
	</div>
	<div class="bg-white px-5 pt-9">
		<SummaryCard
			title="ACTIVITY SUMMARY"
			items={[
				{
					label: 'Total Matakuliah',
					value: 4,
					bgIconClass: 'bg-second',
					colorClass: 'text-primary',
					icon: iconMataKuliah
				},
				{
					label: 'File Tersimpan',
					value: 35,
					bgIconClass: 'bg-second',
					colorClass: 'text-primary',
					icon: iconFile
				}
			]}
		/>

		<!-- <SummaryCard
			title="ORGANIZE SUMMARY"
			items={[
				{
					label: 'PDF',
					value: 4,
					bgIconClass: 'bg-secondErr',
					colorClass: 'text-danger',
					icon: iconPDF
				},
				{
					label: 'MP3',
					value: 4,
					bgIconClass: 'bg-second',
					colorClass: 'text-primary',
					icon: iconFile
				},
				{
					label: 'IMG',
					value: 4,
					bgIconClass: 'bg-secondDone',
					colorClass: 'text-success',
					icon: iconIMG
				},
				{
					label: 'TXT',
					value: 35,
					bgIconClass: 'bg-secondWarn',
					colorClass: 'text-warning',
					icon: iconTXT
				}
			]}
		/> -->
	</div>
</div>
