<script lang="ts">
	let deferredPrompt: Event | null = $state(null);
	let installSupported = $state(false);

	$effect(() => {
		if (typeof window === 'undefined') return;

		const handler = (e: Event) => {
			e.preventDefault();
			deferredPrompt = e;
			installSupported = true;
		};
		window.addEventListener('beforeinstallprompt', handler);
		return () => window.removeEventListener('beforeinstallprompt', handler);
	});

	function onInstallClick() {
		if (!deferredPrompt) return;
		(deferredPrompt as any).prompt();
		(deferredPrompt as any).userChoice.then((result: { outcome: string }) => {
			if (result.outcome === 'accepted') deferredPrompt = null;
		});
	}
</script>

<svelte:head>
	<title>Smart Lecture Organizer</title>
	<meta name="description" content="Atur materi belajarmu dengan rapi. Organizer dokumen, rekaman, video, dan gambar." />
</svelte:head>

<div class="min-h-screen bg-slate-950 light:bg-stone-50 text-slate-100 light:text-stone-900">
	<!-- Navbar -->
	<nav class="flex items-center justify-between px-8 py-5 max-w-7xl mx-auto">
		<div class="flex items-center gap-2">
			<span class="text-2xl font-bold bg-linear-to-r from-stone-500 to-stone-400 bg-clip-text text-transparent light:from-stone-700 light:to-stone-600">
			Smart Lecture Organizer
			</span>
		</div>
		<div class="flex items-center gap-4">
			<a href="/auth/login" class="text-sm text-slate-400 light:text-stone-500 hover:text-slate-100 light:hover:text-stone-900 transition-colors">
				Masuk
			</a>
			<a
				href="/auth/register"
				class="text-sm px-5 py-2 rounded-full bg-indigo-600 hover:bg-indigo-500 transition-colors font-medium text-white"
			>
				Coba Gratis
			</a>
		</div>
	</nav>

	<!-- Hero -->
	<section class="px-6 pt-24 pb-20 max-w-5xl mx-auto text-center">
		<div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-slate-700 light:border-stone-300 bg-slate-800/50 light:bg-stone-100 text-xs text-slate-400 light:text-stone-500 mb-8">
			<span class="w-2 h-2 rounded-full bg-emerald-400"></span>
			PWA siap diinstall
		</div>

		<h1 class="text-5xl md:text-7xl font-bold tracking-tight leading-tight">
			Belajar lebih
			<br />
			<span class="bg-linear-to-r from-stone-500 via-stone-400 to-stone-300 bg-clip-text text-transparent light:from-stone-700 light:via-stone-600 light:to-stone-500">
				terorganisir
			</span>
		</h1>

		<p class="mt-6 text-lg md:text-xl text-slate-400 light:text-stone-500 max-w-2xl mx-auto leading-relaxed">
			Smart Lecture Organizer membantu mahasiswa dan pelajar mengatur dokumen, rekaman, video, dan gambar
			belajar dalam grup yang fleksibel. Lengkap dengan OCR, task management, dan akses offline.
		</p>

		<div class="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
			<a
				href="/auth/login"
				class="px-8 py-3.5 rounded-full bg-linear-to-r from-stone-700 to-stone-600 hover:from-stone-600 hover:to-stone-500 transition-all duration-200 font-semibold text-base shadow-lg shadow-stone-700/25 text-white"
			>
				Masuk ke Aplikasi
			</a>
			{#if installSupported}
				<button
					onclick={onInstallClick}
					class="px-8 py-3.5 rounded-full border border-slate-600 light:border-stone-300 hover:border-slate-500 light:hover:border-stone-400 hover:bg-slate-800 light:hover:bg-stone-100 transition-all duration-200 font-semibold text-base"
				>
					Install Aplikasi
				</button>
			{/if}
		</div>

		{#if !installSupported}
			<div class="mt-6 flex items-center justify-center gap-4 text-sm text-slate-500 light:text-stone-400">
				<span>Atau install lewat browser:</span>
				<span class="flex items-center gap-1.5">
					<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v12m0 0l-4-4m4 4l4-4M4 16v4h16v-4"/></svg>
					Chrome ⋮ → Install
				</span>
				<span class="flex items-center gap-1.5">
					<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v12m0 0l-4-4m4 4l4-4M4 16v4h16v-4"/></svg>
					Safari 􀊨 → Add ke Home Screen
				</span>
			</div>
		{/if}
	</section>

	<!-- Fitur -->
	<section class="px-6 py-20 max-w-6xl mx-auto">
		<h2 class="text-3xl md:text-4xl font-bold text-center mb-4">
			Kenapa Smart Lecture Organizer?
		</h2>
		<p class="text-slate-400 light:text-stone-500 text-center mb-14 max-w-xl mx-auto">
			Semua fitur yang kamu butuhkan untuk mengatur materi belajar dalam satu tempat.
		</p>

		<div class="grid md:grid-cols-3 gap-6">
			<div class="p-6 rounded-2xl bg-slate-900 light:bg-white border border-slate-800 light:border-stone-200 hover:border-slate-700 light:hover:border-stone-300 transition-colors">
				<div class="w-10 h-10 rounded-xl bg-indigo-600/20 flex items-center justify-center mb-4">
					<svg class="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/></svg>
				</div>
				<h3 class="font-semibold text-lg mb-2">Grup Fleksibel</h3>
				<p class="text-sm text-slate-400 light:text-stone-500 leading-relaxed">
					Buat grup bersarang dengan kustomisasi bebas. Judul, warna, ikon — semua sesuai keinginanmu.
				</p>
			</div>

			<div class="p-6 rounded-2xl bg-slate-900 light:bg-white border border-slate-800 light:border-stone-200 hover:border-slate-700 light:hover:border-stone-300 transition-colors">
				<div class="w-10 h-10 rounded-xl bg-violet-600/20 flex items-center justify-center mb-4">
					<svg class="w-5 h-5 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
				</div>
				<h3 class="font-semibold text-lg mb-2">OCR Otomatis</h3>
				<p class="text-sm text-slate-400 light:text-stone-500 leading-relaxed">
					Ubah gambar menjadi teks dengan OCR.space. Cocok untuk mencatat dari slide presentasi atau buku.
				</p>
			</div>

			<div class="p-6 rounded-2xl bg-slate-900 light:bg-white border border-slate-800 light:border-stone-200 hover:border-slate-700 light:hover:border-stone-300 transition-colors">
				<div class="w-10 h-10 rounded-xl bg-purple-600/20 flex items-center justify-center mb-4">
					<svg class="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
				</div>
				<h3 class="font-semibold text-lg mb-2">Task & Deadline</h3>
				<p class="text-sm text-slate-400 light:text-stone-500 leading-relaxed">
					Buat tugas dengan tenggat waktu. Assign ke grup atau materi tertentu agar tidak terlewat.
				</p>
			</div>

			<div class="p-6 rounded-2xl bg-slate-900 light:bg-white border border-slate-800 light:border-stone-200 hover:border-slate-700 light:hover:border-stone-300 transition-colors">
				<div class="w-10 h-10 rounded-xl bg-emerald-600/20 flex items-center justify-center mb-4">
					<svg class="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"/></svg>
				</div>
				<h3 class="font-semibold text-lg mb-2">Akses Offline</h3>
				<p class="text-sm text-slate-400 light:text-stone-500 leading-relaxed">
					Download materi untuk akses offline. File tersimpan di perangkat dan dapat dideteksi otomatis.
				</p>
			</div>

			<div class="p-6 rounded-2xl bg-slate-900 light:bg-white border border-slate-800 light:border-stone-200 hover:border-slate-700 light:hover:border-stone-300 transition-colors">
				<div class="w-10 h-10 rounded-xl bg-amber-600/20 flex items-center justify-center mb-4">
					<svg class="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
				</div>
				<h3 class="font-semibold text-lg mb-2">Pencarian Global</h3>
				<p class="text-sm text-slate-400 light:text-stone-500 leading-relaxed">
					Cari materi dengan teks atau gambar. Temukan apapun dengan cepat dari seluruh koleksi.
				</p>
			</div>

			<div class="p-6 rounded-2xl bg-slate-900 light:bg-white border border-slate-800 light:border-stone-200 hover:border-slate-700 light:hover:border-stone-300 transition-colors">
				<div class="w-10 h-10 rounded-xl bg-rose-600/20 flex items-center justify-center mb-4">
					<svg class="w-5 h-5 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/></svg>
				</div>
				<h3 class="font-semibold text-lg mb-2">Bookmark & Pin</h3>
				<p class="text-sm text-slate-400 light:text-stone-500 leading-relaxed">
					Tandai materi favorit dengan bookmark. Pin item penting untuk akses cepat kapan saja.
				</p>
			</div>
		</div>
	</section>

	<!-- CTA Install -->
	<section class="px-6 py-20 max-w-4xl mx-auto text-center">
		<div class="p-10 md:p-14 rounded-3xl bg-linear-to-br from-slate-900 light:from-white to-slate-950 light:to-stone-50 border border-slate-800 light:border-stone-200">
			<h2 class="text-3xl md:text-4xl font-bold mb-4">
				Siap belajar lebih rapi?
			</h2>
			<p class="text-slate-400 light:text-stone-500 mb-8 max-w-lg mx-auto">
				Gunakan Smart Lecture Organizer di perangkat manapun. Install sebagai aplikasi untuk pengalaman native tanpa gangguan.
			</p>
			<div class="flex flex-col sm:flex-row items-center justify-center gap-4">
			<a
				href="/auth/register"
				class="px-8 py-3.5 rounded-full bg-linear-to-r from-stone-700 to-stone-600 hover:from-stone-600 hover:to-stone-500 transition-all duration-200 font-semibold shadow-lg shadow-stone-700/25"
			>
				Mulai Sekarang
			</a>
				{#if installSupported}
					<button
						onclick={onInstallClick}
						class="px-8 py-3.5 rounded-full border border-slate-600 light:border-stone-300 hover:border-slate-500 light:hover:border-stone-400 hover:bg-slate-800 light:hover:bg-stone-100 transition-all duration-200 font-semibold"
					>
						<span class="flex items-center gap-2">
							<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v12m0 0l-4-4m4 4l4-4M4 16v4h16v-4"/></svg>
							Install PWA
						</span>
					</button>
				{/if}
			</div>
			<p class="mt-6 text-sm text-slate-500 light:text-stone-400">
				Gratis • 50 MB penyimpanan online • Offline support
			</p>
		</div>
	</section>

	<!-- Footer -->
	<footer class="px-6 py-8 border-t border-slate-800 light:border-stone-200">
		<div class="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-500 light:text-stone-400">
			<span>Smart Lecture Organizer</span>
			<span>Dibuat untuk mahasiswa dan pelajar mandiri</span>
		</div>
	</footer>
</div>
