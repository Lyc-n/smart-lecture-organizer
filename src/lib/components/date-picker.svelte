<script lang="ts">
	import { fly } from 'svelte/transition';

	const today = new Date();

	const dates = Array.from({ length: 30 }, (_, i) => {
		return new Date(today.getFullYear(), today.getMonth(), today.getDate() - 15 + i);
	});

	let currentIndex = $state(15);
	let direction = $state<'left' | 'right'>('right');
	const selectedDate = $derived(dates[currentIndex]);

	const visibleDates = $derived([
		dates[currentIndex - 1],
		dates[currentIndex],
		dates[currentIndex + 1]
	]);

	function next() {
		direction = 'right';

		if (currentIndex < dates.length - 2) {
			currentIndex++;
		}
	}

	function prev() {
		direction = 'left';

		if (currentIndex > 1) {
			currentIndex--;
		}
	}
</script>

<div class="flex flex-col gap-4">
	<!-- Header -->
	<div class="flex items-center justify-between">
		<h2 class="text-lg font-semibold capitalize">
			{selectedDate.toLocaleDateString('id-ID', {
				month: 'long',
				year: 'numeric'
			})}
		</h2>

		<div class="flex gap-2">
			<button
				aria-label="previous date"
				class="rounded-full border p-2 hover:bg-muted"
				onclick={prev}
			>
				<i class="ph ph-caret-left text-lg"></i>
			</button>

			<button aria-label="next date" class="rounded-full border p-2 hover:bg-muted" onclick={next}>
				<i class="ph ph-caret-right text-lg"></i>
			</button>
		</div>
	</div>

	<!-- Date Cards -->
	<div class="">
		{#key currentIndex}
			<div class="grid min-w-56 grid-cols-3 gap-3">
				{#each visibleDates as date, index (date.getTime())}
					<div
						in:fly={{
							x: direction === 'right' ? 40 : -40,
							duration: 550
						}}
						out:fly={{
							x: direction === 'right' ? -40 : 40,
							duration: 550
						}}
						class={`flex h-22 w-full flex-col items-center justify-center rounded-4xl border transition-all duration-300 ${
							index === 1 ? 'scale-105 bg-primary text-white shadow-md' : 'scale-95 opacity-50'
						}`}
					>
						<div class={`text-sm ${index === 1 ? 'text-white' : 'text-muted-foreground'}`}>
							{date.toLocaleDateString('id-ID', {
								weekday: 'short'
							})}
						</div>

						<div class="mt-1 text-3xl font-bold tabular-nums">
							{date.getDate()}
						</div>
					</div>
				{/each}
			</div>
		{/key}
	</div>
</div>
