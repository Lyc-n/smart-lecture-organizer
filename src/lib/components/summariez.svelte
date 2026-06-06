<script lang="ts">
	import type { Snippet } from 'svelte';

	interface SummaryItem {
		label: string;
		value: number | string;
		bgIconClass?: string;
		colorClass?: string;
		icon?: Snippet;
	}

	let {
		title = '',
		items = []
	}: {
		title: string;
		items: SummaryItem[];
	} = $props();
</script>

<div
	class="bg-surface flex w-full flex-col gap-6 rounded-2xl border-2 border-innactive/20 px-6 py-5"
>
	<!-- Tittle -->
	<div class="flex flex-col">
		<div class="text-sm font-bold tracking-wide">
			{title}
		</div>
	</div>

	<!-- Objects -->
	<div class="flex flex-col gap-3">
		{#each items as item (item.label)}
			<div
				class="flex items-center justify-between gap-3 rounded-xl bg-divider/30 px-5 py-3 shadow shadow-innactive/30 transition-all duration-300 active:scale-95"
			>
				<div class="flex items-center gap-3">
					<div
						class="h-10 w-10 {item.bgIconClass ||
							'bg-second'} flex items-center justify-center rounded-xl"
					>
						<div class="flex flex-col">
							{#if item.icon}
								{@render item.icon()}
							{:else}
								<div class="h-4 w-5 {item.colorClass || 'bg-primary'}"></div>
							{/if}
						</div>
					</div>

					<div class="flex flex-col whitespace-nowrap">
						<div
							class="justify-center {item.colorClass ||
								'text-primary'} font-poppins text-sm leading-6 font-medium"
						>
							{item.label}
						</div>
					</div>
				</div>

				<div class="flex flex-col">
					<div
						class="justify-center {item.colorClass ||
							'text-primary'} font-poppins text-base leading-6 font-medium"
					>
						{item.value}
					</div>
				</div>
			</div>
		{/each}
	</div>
</div>
