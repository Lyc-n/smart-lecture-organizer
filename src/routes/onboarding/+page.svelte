<script lang="ts">
	import { page } from '$app/stores';
	import { browser } from '$app/environment';

	type Step = {
		icon: string;
		title: string;
		description: string;
	};

	const steps: Step[] = [
		{
			icon: 'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5',
			title: 'Selamat datang di Smart Lecture Organizer',
			description:
				'Smart Learning Organizer. Atur semua materi belajarmu dalam satu tempat.'
		},
		{
			icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10',
			title: 'Kelompokkan Materimu',
			description:
				'Buat grup bersarang dengan warna dan ikon. Rekomendasi otomatis untuk pertemuan kuliah.'
		},
		{
			icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
			title: 'OCR & Catatan',
			description:
				'Ubah gambar slide atau buku jadi teks. Simpan sebagai catatan yang bisa dicari kapan saja.'
		},
		{
			icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
			title: 'Task & Deadline',
			description:
				'Buat tugas dengan tenggat. Assign ke grup atau materi agar tidak ada yang terlewat.'
		},
		{
			icon: 'M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z',
			title: 'Akses Offline',
			description:
				'Download materi untuk belajar tanpa internet. File lokal terdeteksi otomatis.'
		}
	];

	let currentStep = $state(0);
	let touchStartX = $state(0);

	function next() {
		if (currentStep < steps.length - 1) {
			currentStep++;
		}
	}

	function prev() {
		if (currentStep > 0) {
			currentStep--;
		}
	}

	function handleTouchStart(e: TouchEvent) {
		touchStartX = e.touches[0].clientX;
	}

	function handleTouchEnd(e: TouchEvent) {
		const diff = touchStartX - e.changedTouches[0].clientX;
		if (Math.abs(diff) > 50) {
			if (diff > 0) next();
			else prev();
		}
	}
</script>

<svelte:head>
	<title>Selamat datang di Smart Lecture Organizer</title>
</svelte:head>

<div
	class="h-dvh w-full bg-slate-950 light:bg-slate-50 text-slate-100 light:text-slate-900 flex flex-col overflow-hidden select-none"
	role="region"
	aria-label="Onboarding"
	ontouchstart={handleTouchStart}
	ontouchend={handleTouchEnd}
>
	<!-- Skip button -->
	<div class="flex justify-end px-6 pt-5">
		{#if currentStep < steps.length - 1}
			<a
				href="/app"
				class="text-sm text-slate-500 light:text-slate-400 hover:text-slate-300 light:hover:text-slate-600 transition-colors px-4 py-2"
			>
				Skip
			</a>
		{:else}
			<div class="w-16"></div>
		{/if}
	</div>

	<!-- Content area -->
	<div class="flex-1 flex flex-col items-center justify-center px-8">
		<div class="transition-all duration-300 ease-out">
			{#each steps as step, i}
				{#if i === currentStep}
					<div class="flex flex-col items-center text-center max-w-sm">
						<div class="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-600/30 to-violet-600/30 border border-indigo-500/20 flex items-center justify-center mb-8">
							<svg
								class="w-10 h-10 text-indigo-400"
								fill="none"
								stroke="currentColor"
								stroke-width="1.5"
								viewBox="0 0 24 24"
							>
								<path stroke-linecap="round" stroke-linejoin="round" d={step.icon} />
							</svg>
						</div>
						<h1 class="text-2xl font-bold mb-3">{step.title}</h1>
						<p class="text-slate-400 light:text-slate-500 leading-relaxed">{step.description}</p>
					</div>
				{/if}
			{/each}
		</div>
	</div>

	<!-- Dots + Navigation -->
	<div class="px-8 pb-12">
		<div class="flex items-center justify-center gap-2 mb-8">
			{#each steps as _, i}
				<button
					onclick={() => (currentStep = i)}
					class="h-2 rounded-full transition-all duration-300 cursor-pointer {i === currentStep ? 'bg-indigo-500' : 'bg-slate-700 light:!bg-slate-200'}"
					style:width={i === currentStep ? '24px' : '8px'}
					aria-label="Langkah {i + 1}"
				></button>
			{/each}
		</div>

		{#if currentStep < steps.length - 1}
			<button
				onclick={next}
				class="w-full py-3.5 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 transition-all duration-200 font-semibold text-base shadow-lg shadow-indigo-600/25 cursor-pointer"
			>
				Lanjut
			</button>
		{:else}
			<a
				href="/app"
				class="block w-full py-3.5 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 transition-all duration-200 font-semibold text-base text-center shadow-lg shadow-indigo-600/25"
			>
				Mulai Belajar
			</a>
		{/if}
	</div>
</div>
