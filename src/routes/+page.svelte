<script lang="ts">
</script>

<svelte:head>
	<title>SmartLO</title>
	<meta name="description" content="Atur materi belajarmu dengan rapi. Organizer dokumen, rekaman, video, dan gambar." />
</svelte:head>

<div class="min-h-screen bg-bg-surface text-text-base">
	<!-- Navbar -->
	<nav class="flex items-center justify-between px-8 py-3 sticky top-0 bg-bg-surface max-w-full mx-auto">
		<div class="flex items-center gap-2">
			<span class="text-xl font-bold bg-linear-to-r from-primary to-primary-hover bg-clip-text text-transparent light:from-stone-700 light:to-stone-600">
			SmartLO
			</span>
		</div>
		<div class="flex items-center gap-4">
			<a href="/auth/login" class="text-sm text-text-secondary hover:text-text-base transition-colors">
				Masuk
			</a>
			<a
				href="/auth/register"
				class="text-sm px-5 py-2 rounded-md bg-primary hover:bg-primary/90 duration-300 transition-colors font-medium text-white light:bg-stone-700 light:hover:bg-stone-600 light:text-white"
			>
				Coba Gratis
			</a>
		</div>
	</nav>

	<!-- Hero -->
	<section class="px-6 pt-24 pb-20 max-w-full mx-auto text-center page-with-pattern">
		<h1 class="text-6xl md:text-8xl font-extralight tracking-tight leading-tight">
			Belajar lebih rapi
			<br>
			<span class="bg-linear-to-br from-violet-800 via-primary to-primary-hover bg-clip-text text-transparent light:from-stone-700 light:via-stone-600 light:to-stone-500">
				sekarang
			</span>
		</h1>

		<p class="mt-8 text-sm md:text-lg text-text-secondary max-w-3xl mx-auto leading-relaxed">
			SmartLO membantu mahasiswa dan pelajar mengatur dokumen, rekaman, video, dan gambar
			belajar dalam grup yang fleksibel. Lengkap dengan OCR, task management, dan pencarian global.
		</p>

		<div class="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
			<a
				href="/auth/register"
				class="px-8 py-3.5 rounded-full bg-primary hover:bg-primary/90 transition-all duration-200 font-semibold text-base text-white"
			>
				Mulai Sekarang
			</a>
		</div>
	</section>

	<!-- Fitur -->
	<section class="px-6 py-20 max-w-6xl mx-auto">
		<h2 class="text-3xl md:text-4xl font-semibold text-center mb-4">
			Kenapa SmartLO?
		</h2>
		<p class="text-text-secondary text-center mb-14 max-w-2xl mx-auto">
			Semua fitur yang kamu butuhkan untuk mengatur materi belajar dalam satu tempat.
		</p>

		<div class="grid md:grid-cols-3 gap-6">
			<div class="p-6 rounded-xl bg-bg-elevated border border-border-main hover:border-border-hover transition-colors">
				<div class="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center mb-4">
					<svg class="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/></svg>
				</div>
				<h3 class="font-semibold text-lg mb-2">Grup Fleksibel</h3>
				<p class="text-sm text-text-secondary leading-relaxed">
					Buat grup bersarang dengan kustomisasi bebas. Judul, warna, ikon — semua sesuai keinginanmu.
				</p>
			</div>

			<div class="p-6 rounded-xl bg-bg-elevated border border-border-main hover:border-border-hover transition-colors">
				<div class="w-10 h-10 rounded-lg bg-violet-600/20 flex items-center justify-center mb-4">
					<svg class="w-5 h-5 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
				</div>
				<h3 class="font-semibold text-lg mb-2">OCR Otomatis</h3>
				<p class="text-sm text-text-secondary leading-relaxed">
					Ubah gambar menjadi teks dengan OCR.space. Cocok untuk mencatat dari slide presentasi atau buku.
				</p>
			</div>

			<div class="p-6 rounded-xl bg-bg-elevated border border-border-main hover:border-border-hover transition-colors">
				<div class="w-10 h-10 rounded-lg bg-purple-600/20 flex items-center justify-center mb-4">
					<svg class="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
				</div>
				<h3 class="font-semibold text-lg mb-2">Task & Deadline</h3>
				<p class="text-sm text-text-secondary leading-relaxed">
					Buat tugas dengan tenggat waktu. Assign ke grup atau materi tertentu agar tidak terlewat.
				</p>
			</div>

			<div class="p-6 rounded-xl bg-bg-elevated border border-border-main hover:border-border-hover transition-colors">
				<div class="w-10 h-10 rounded-lg bg-tertiary/20 flex items-center justify-center mb-4">
					<svg class="w-5 h-5 text-tertiary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
				</div>
				<h3 class="font-semibold text-lg mb-2">Pencarian Global</h3>
				<p class="text-sm text-text-secondary leading-relaxed">
					Cari materi dengan teks atau gambar. Temukan apapun dengan cepat dari seluruh koleksi.
				</p>
			</div>

			<div class="p-6 rounded-xl bg-bg-elevated border border-border-main hover:border-border-hover transition-colors">
				<div class="w-10 h-10 rounded-lg bg-rose-600/20 flex items-center justify-center mb-4">
					<svg class="w-5 h-5 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/></svg>
				</div>
				<h3 class="font-semibold text-lg mb-2">Bookmark & Pin</h3>
				<p class="text-sm text-text-secondary leading-relaxed">
					Tandai materi favorit dengan bookmark. Pin item penting untuk akses cepat kapan saja.
				</p>
			</div>

			<div class="p-6 rounded-xl bg-bg-elevated border border-border-main hover:border-border-hover transition-colors">
				<div class="w-10 h-10 rounded-lg bg-success/20 flex items-center justify-center mb-4">
					<svg class="w-5 h-5 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
				</div>
				<h3 class="font-semibold text-lg mb-2">Penyimpanan Cloud</h3>
				<p class="text-sm text-text-secondary leading-relaxed">
					Simpan materi di cloud dengan aman. Akses dari perangkat manapun dengan akunmu.
				</p>
			</div>
		</div>
	</section>

	<!-- CTA -->
	<section class="px-6 py-20 max-w-full text-center page-with-pattern">
		<div class="p-10 md:p-14 md:w-4xl mx-auto rounded-3xl bg-linear-to-br from-bg-elevated to-primary/20 from-40% light:to-bg-base border border-border-main">
			<h2 class="text-3xl md:text-4xl font-semibold mb-4">
				Siap belajar lebih rapi?
			</h2>
			<p class="text-text-secondary mb-8 max-w-lg mx-auto">
				Gunakan SmartLO di perangkat manapun. Daftar gratis dan mulai mengatur materi belajarmu.
			</p>
			<div class="flex flex-col sm:flex-row items-center justify-center gap-4">
			<a
				href="/auth/register"
				class="px-8 py-3.5 rounded-lg bg-linear-to-br light:from-stone-700 light:to-stone-500 light:text-white light:hover:from-stone-600 light:hover:to-stone-500 from-primary/50 to-primary transition-all duration-200 font-semibold shadow-lg shadow-stone-700/25"
			>
				Mulai Sekarang
			</a>
			</div>
			<p class="mt-6 text-sm text-text-muted">
				Gratis • 50 MB penyimpanan online
			</p>
		</div>
	</section>

	<!-- Footer -->
	<footer class="px-6 py-8 border-t border-border-main">
		<div class="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-text-muted">
			<span>SmartLO</span>
			<span>Dibuat untuk mahasiswa dan pelajar mandiri</span>
		</div>
	</footer>
</div>
