<script lang="ts">
	import { resolve } from "$app/paths";

	// SvelteKit 5 runes — no $: syntax, no export let for page-level state
	let mobileMenuOpen = $state(false);
	// let activeNav = $state('Features');

	// const navLinks = $derived(['Features', 'Pricing', 'About']);

	const features = [
		{
			title: 'Smart OCR',
			desc: 'Extract handwritten notes from whiteboard photos instantly with precision.',
			accent: 'from-[#3525cd] to-indigo-500',
			border: 'border-l-[#3525cd]/40',
			icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-5 h-5 text-white"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M7 8h10M7 12h6M7 16h8"/></svg>`
		},
		{
			title: 'Smart Folders',
			desc: 'Organize materials by Course Weeks or Project Sprints automatically.',
			accent: 'from-[#34d399] to-teal-600',
			border: 'border-l-[#34d399]/40',
			icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-5 h-5 text-white"><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>`
		},
		{
			title: 'AI Summaries',
			desc: 'Get condensed bullet points and key takeaways from long lecture transcripts.',
			accent: 'from-amber-400 to-orange-500',
			border: 'border-l-amber-400/40',
			icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-5 h-5 text-white"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>`
		},
		{
			title: 'Active Insights',
			desc: 'Visualize your learning pace with automated heatmap generators.',
			accent: 'from-[#006A61] to-cyan-600',
			border: 'border-l-[#006A61]/40',
			icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-5 h-5 text-white"><path d="M3 3v18h18"/><path d="m7 16 4-4 4 4 4-4"/></svg>`
		}
	] as const;

	const syncs = [
		{
			label: 'Real-time device sync',
			icon: `<svg viewBox="0 0 24 24" fill="none" stroke="#3525cd" stroke-width="2" class="w-5 h-5"><path d="M21 2v6h-6"/><path d="M3 12a9 9 0 0 1 15-6.7L21 8"/><path d="M3 22v-6h6"/><path d="M21 12a9 9 0 0 1-15 6.7L3 16"/></svg>`
		},
		{
			label: 'Automated cloud backup',
			icon: `<svg viewBox="0 0 24 24" fill="none" stroke="#3525cd" stroke-width="2" class="w-5 h-5"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/></svg>`
		}
	];
</script>

<!-- ============================================================
     NAV — glassmorphism pill, sticky
     ============================================================ -->
<header class="fixed inset-x-0 top-4 z-50 flex justify-center px-4">
	<nav
		class="flex h-16 w-full max-w-6xl items-center justify-between rounded-2xl border
           border-white/50 bg-white/90 px-6 shadow-[0_8px_10px_-6px_rgba(0,0,0,0.1),0_20px_25px_-5px_rgba(0,0,0,0.1)]
           backdrop-blur-md"
	>
		<!-- Logo -->
		<a href={resolve('/')} class="flex items-center gap-2">
			<span
				class="flex h-8 w-8 items-center justify-center rounded-lg bg-[#3525cd]
               shadow-[0_4px_6px_-4px_rgba(53,37,205,0.2),0_10px_15px_-3px_rgba(53,37,205,0.2)]"
			>
				<svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" class="h-4 w-4">
					<path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path
						d="M2 12l10 5 10-5"
					/>
				</svg>
			</span>
			<span
				class="text-lg font-bold tracking-tight text-[#3525cd]"
				style="font-family: 'Plus Jakarta Sans', sans-serif;">SLO</span
			>
		</a>

		<!-- Desktop links
		<ul class="hidden items-center gap-8 md:flex">
			{#each navLinks as link}
				<li>
					<button
						onclick={() => (activeNav = link)}
						class="text-base transition-colors {activeNav === link
							? 'font-semibold text-[#3525cd]'
							: 'font-normal text-[#464555] hover:text-[#3525cd]'}"
					>
						{link}
					</button>
				</li>
			{/each}
		</ul> -->

		<!-- CTA group -->
		<div class="hidden items-center gap-3 md:flex">
			<a href={resolve('/auth')} class="px-3 py-1.5 text-base text-[#464555] transition-colors hover:text-[#3525cd]">
				Login
			</a>
			<button
				class="rounded-xl bg-[#3525cd] px-4 py-1.5 text-base font-medium text-white
               shadow-[0_4px_6px_-4px_rgba(53,37,205,0.2),0_10px_15px_-3px_rgba(53,37,205,0.2)]
               transition-colors hover:bg-[#2b1eb0]"
			>
				Get Started
			</button>
		</div>

		<!-- Mobile hamburger -->
		<button
			class="rounded-lg p-2 transition-colors hover:bg-gray-100 md:hidden"
			onclick={() => (mobileMenuOpen = !mobileMenuOpen)}
			aria-label="Toggle menu"
		>
			{#if mobileMenuOpen}
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="h-5 w-5">
					<path d="M18 6 6 18M6 6l12 12" />
				</svg>
			{:else}
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="h-5 w-5">
					<path d="M3 12h18M3 6h18M3 18h18" />
				</svg>
			{/if}
		</button>
	</nav>

	<!-- Mobile dropdown -->
	{#if mobileMenuOpen}
		<div
			class="absolute inset-x-4 top-20 flex flex-col gap-4 rounded-2xl
             border border-white/50 bg-white/95 p-6 shadow-xl backdrop-blur-md md:hidden"
		>
			<!-- {#each navLinks as link}
				<button
					onclick={() => {
						activeNav = link;
						mobileMenuOpen = false;
					}}
					class="text-left text-base {activeNav === link
						? 'font-semibold text-[#3525cd]'
						: 'text-[#464555]'}"
				>
					{link}
				</button>
			{/each} -->
			<hr class="border-gray-100" />
			<button class="text-left text-base text-[#464555]">Login</button>
			<button class="w-full rounded-xl bg-[#3525cd] py-2.5 font-medium text-white"
				>Get Started</button
			>
		</div>
	{/if}
</header>

<!-- ============================================================
     MAIN WRAPPER
     ============================================================ -->
<main class="relative flex flex-col items-stretch overflow-x-hidden bg-[#f9f9ff]">
	<!-- ============================================================
       HERO
       ============================================================ -->
	<section
		class="relative px-4 pt-32 pb-16 sm:px-6 lg:px-10"
		style="background: radial-gradient(ellipse 60% 50% at 20% 40%, rgba(219,217,252,0.7) 0%, transparent 60%),
                        radial-gradient(ellipse 50% 60% at 80% 60%, rgba(224,244,255,0.8) 0%, transparent 60%),
                        radial-gradient(ellipse 40% 40% at 50% 80%, rgba(243,233,252,0.6) 0%, transparent 60%),
                        #f9f9ff;"
	>
		<!-- Ambient blobs -->
		<div
			class="pointer-events-none absolute -top-20 -left-20 h-[400px] w-[400px] rounded-full bg-[#3525cd]/20 opacity-60 blur-[60px]"
			aria-hidden="true"
		></div>
		<div
			class="pointer-events-none absolute -right-20 -bottom-10 h-[500px] w-[500px] rounded-full bg-[#006A61]/15 opacity-60 blur-[60px]"
			aria-hidden="true"
		></div>

		<div
			class="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16"
		>
			<!-- Left: copy -->
			<div class="order-2 flex flex-col items-start gap-5 lg:order-1">
				<!-- Badge -->
				<div
					class="flex items-center gap-2 rounded-full border border-white/80 bg-white/60 px-3 py-1
                 text-[10px] font-semibold tracking-[0.5px] text-[#3525cd] uppercase shadow-sm"
				>
					<svg
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2.5"
						class="h-3.5 w-3.5"
					>
						<circle cx="12" cy="12" r="10" /><path d="m9 12 2 2 4-4" />
					</svg>
					V2.0 Fluid Release
				</div>

				<!-- Headline -->
				<h1
					class="text-5xl leading-[1.05] font-bold text-[#111c2d] sm:text-6xl lg:text-[64px]"
					style="font-family: 'Plus Jakarta Sans', sans-serif;"
				>
					Build Your<br />
					<span class="text-[#3525cd]">Digital Second</span><br />
					Brain.
				</h1>

				<!-- Sub -->
				<p class="max-w-md text-base leading-[1.7] text-[#464555]/90">
					The all-in-one workspace to organize lectures, extract whiteboard text via AI OCR, and
					track study habits automatically.
				</p>

				<!-- CTA buttons -->
				<div class="flex flex-wrap gap-3 pt-2">
					<button
						class="flex items-center gap-2 rounded-2xl bg-[#3525cd] px-6 py-4 text-base font-semibold text-white
                   shadow-[0_8px_10px_-6px_rgba(53,37,205,0.25),0_20px_25px_-5px_rgba(53,37,205,0.25)]
                   transition-all hover:bg-[#2b1eb0] active:scale-[0.98]"
					>
						Start Free
						<svg
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2.5"
							class="h-4 w-4"
						>
							<path d="M5 12h14M12 5l7 7-7 7" />
						</svg>
					</button>
					<button
						class="flex items-center gap-2 rounded-2xl border border-white/60 bg-white/40 px-6 py-3.5
                   text-base font-semibold text-[#111c2d] backdrop-blur-md
                   transition-all hover:bg-white/70 active:scale-[0.98]"
					>
						<svg
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							class="h-4 w-4"
						>
							<circle cx="12" cy="12" r="10" /><polygon
								points="10,8 16,12 10,16"
								fill="currentColor"
							/>
						</svg>
						Watch Demo
					</button>
				</div>
			</div>

			<!-- Right: product mockup card -->
			<div class="relative order-1 lg:order-2">
				<!-- Ambient blob behind card -->
				<div
					class="pointer-events-none absolute -top-10 -left-10 h-40 w-40 rounded-full bg-[#006A61]/20 blur-[32px]"
					aria-hidden="true"
				></div>

				<div
					class="relative overflow-hidden rounded-[40px] border-2 border-white/60 bg-white/40 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)]
                 backdrop-blur-md"
				>
					<!-- Fake browser chrome -->
					<div class="flex items-center gap-2 border-b border-white/50 bg-[#f1f5f9]/80 px-5 py-3">
						<span class="h-3 w-3 rounded-full bg-red-300"></span>
						<span class="h-3 w-3 rounded-full bg-yellow-300"></span>
						<span class="h-3 w-3 rounded-full bg-green-300"></span>
						<div
							class="ml-3 flex h-6 flex-1 items-center rounded-full border border-white/50 bg-white/60 px-3"
						>
							<span class="text-[11px] text-[#464555]/60">app.slo.study / dashboard</span>
						</div>
					</div>

					<!-- Dashboard mockup body -->
					<div class="bg-white/20 p-5 backdrop-blur-sm">
						<!-- Metric row -->
						<div class="mb-4 grid grid-cols-2 gap-3">
							<div class="rounded-2xl border border-white/60 bg-white/70 p-4 backdrop-blur-sm">
								<p class="mb-1 text-[10px] tracking-wider text-[#464555]/60 uppercase">
									Notes Scanned
								</p>
								<p
									class="text-3xl font-bold text-[#111c2d]"
									style="font-family: 'Plus Jakarta Sans', sans-serif;"
								>
									247 <span class="text-sm font-semibold text-[#006A61]">↑ 12%</span>
								</p>
							</div>
							<div class="rounded-2xl border border-white/60 bg-white/70 p-4 backdrop-blur-sm">
								<p class="mb-1 text-[10px] tracking-wider text-[#464555]/60 uppercase">
									Study Streak
								</p>
								<p
									class="text-3xl font-bold text-[#111c2d]"
									style="font-family: 'Plus Jakarta Sans', sans-serif;"
								>
									5d <span class="text-sm font-semibold text-[#3525cd]">🔥</span>
								</p>
							</div>
						</div>

						<!-- Mini chart -->
						<div class="rounded-2xl border border-white/60 bg-white/70 p-4 backdrop-blur-sm">
							<p class="mb-3 text-[10px] tracking-wider text-[#464555]/60 uppercase">
								Weekly Uploads
							</p>
							<div class="flex h-16 items-end gap-1.5">
								{#each [30, 55, 40, 75, 60, 85, 95] as h, i (i)}
									<div
										class="flex-1 rounded-t-md transition-all {i === 6
											? 'bg-[#3525cd]'
											: i % 2 === 0
												? 'bg-[#3525cd]/20'
												: 'bg-[#006A61]/30'}"
										style="height: {h}%"
									></div>
								{/each}
							</div>
							<div class="mt-1.5 flex gap-1.5">
								{#each ['M', 'T', 'W', 'T', 'F', 'S', 'S'] as d (d)}
									<span class="flex-1 text-center text-[9px] text-[#464555]/50">{d}</span>
								{/each}
							</div>
						</div>
					</div>
				</div>

				<!-- Floating badge: AI OCR Active -->
				<div
					class="absolute -bottom-4 -left-6 flex max-w-[200px] flex-col gap-2
                 rounded-3xl border border-white/80 bg-white/40 p-4 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)]
                 backdrop-blur-md"
				>
					<div class="flex items-center gap-3">
						<span class="flex h-8 w-8 items-center justify-center rounded-xl bg-[#d1fae5]">
							<svg
								viewBox="0 0 24 24"
								fill="none"
								stroke="#059669"
								stroke-width="2.5"
								class="h-4 w-4"
							>
								<path d="m9 12 2 2 4-4" /><circle cx="12" cy="12" r="10" />
							</svg>
						</span>
						<span class="text-xs font-semibold text-[#111c2d]">AI OCR Active</span>
					</div>
					<div class="h-2 overflow-hidden rounded-full bg-[#f1f5f9]/50">
						<div
							class="h-full w-[85%] rounded-full bg-[#10b981]"
							style="box-shadow: 0 0 8px rgba(16,185,129,0.4)"
						></div>
					</div>
				</div>
			</div>
		</div>

		<!-- Social proof pill -->
		<div class="relative mx-auto mt-20 flex max-w-7xl flex-col items-center gap-3">
			<p class="text-[10px] tracking-[3px] text-[#464555]/50 uppercase">
				Trusted by 10k+ digital learners
			</p>
			<div
				class="flex items-center gap-4 rounded-full border border-white/80 bg-white/40 px-6 py-3 shadow-[0_4px_6px_-4px_rgba(0,0,0,0.1),0_10px_15px_-3px_rgba(0,0,0,0.1)]
               backdrop-blur-md"
			>
				<div class="flex -space-x-2">
					{#each ['#818cf8', '#34d399', '#fbbf24'] as color (color)}
						<div
							class="h-8 w-8 rounded-full border-2 border-white"
							style="background:{color}"
						></div>
					{/each}
				</div>
				<p class="text-sm text-[#464555]">
					"Best study tool I've used." <span class="font-semibold text-[#3525cd]">— Maya E.</span>
				</p>
			</div>
		</div>
	</section>

	<!-- ============================================================
       FEATURES
       ============================================================ -->
	<section
		class="relative mx-2 my-4 overflow-hidden rounded-[48px] px-4 py-20 sm:mx-4 sm:px-6 lg:rounded-[64px] lg:px-10"
		style="background: radial-gradient(ellipse 60% 50% at 10% 20%, rgba(210,208,251,0.6) 0%, transparent 55%),
                        radial-gradient(ellipse 50% 40% at 90% 80%, rgba(208,251,251,0.4) 0%, transparent 55%),
                        rgba(255,255,255,0.5);"
	>
		<!-- Ambient blob -->
		<div
			class="pointer-events-none absolute top-0 left-0 h-[300px] w-[300px] rounded-full bg-[#3525cd]/10 opacity-60 blur-[50px]"
			aria-hidden="true"
		></div>

		<div
			class="relative mx-auto grid max-w-7xl grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-16"
		>
			<!-- Left: heading -->
			<div class="flex flex-col gap-5 lg:col-span-4">
				<h2
					class="text-4xl leading-[1.1] font-bold text-[#111c2d] sm:text-[44px]"
					style="font-family: 'Plus Jakarta Sans', sans-serif;"
				>
					Vibrant<br />Engineering<br />
					<span class="text-[#3525cd]">for Minds</span>
				</h2>
				<p class="max-w-sm text-base leading-[1.65] text-[#464555]/80">
					We've removed the clutter so you can focus on what matters: learning faster and retaining
					more.
				</p>
				<button
					class="flex items-center gap-3 text-sm font-semibold text-[#3525cd] transition-all hover:gap-4"
				>
					View all features
					<svg
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2.5"
						class="h-4 w-4"
					>
						<path d="M5 12h14M12 5l7 7-7 7" />
					</svg>
				</button>
			</div>

			<!-- Right: 2×2 feature cards -->
			<div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:col-span-8">
				{#each features as feat (feat)}
					<div
						class="flex flex-col gap-3 rounded-3xl border-t border-r border-b border-l-4 {feat.border}
                   border-white/60 bg-white/40 p-8 shadow-[0_8px_32px_0_rgba(79,70,229,0.08)]
                   backdrop-blur-md transition-shadow
                   hover:shadow-[0_12px_40px_0_rgba(79,70,229,0.14)]"
					>
						<div
							class="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br {feat.accent}
                        shadow-[0_8px_10px_-6px_rgba(0,0,0,0.1),0_20px_25px_-5px_rgba(0,0,0,0.1)]"
						>
							<!-- {@html feat.icon} --> <i class="ph-bold ph-graduation-cap text-xl text-white"></i>
						</div>
						<h3 class="mt-2 text-xl font-semibold text-[#111c2d]">{feat.title}</h3>
						<p class="text-sm leading-[1.65] text-[#464555]/80">{feat.desc}</p>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- ============================================================
       QUANTIFY / STATS
       ============================================================ -->
	<section
		class="relative overflow-hidden bg-white/30 px-4 py-20 backdrop-blur-sm sm:px-6 lg:px-10"
	>
		<div class="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-20">
			<!-- Left: copy + sync pills -->
			<div class="flex flex-col gap-5">
				<h2
					class="text-4xl leading-[1.2] font-bold text-[#111c2d] sm:text-[40px]"
					style="font-family: 'Plus Jakarta Sans', sans-serif;"
				>
					Quantify Your<br />
					<span class="text-[#3525cd]">Academic Growth.</span>
				</h2>
				<p class="max-w-md text-base leading-6 text-[#464555]/80">
					Our sidebar tracks streaks and document counts in real-time, giving you a visual edge on
					your goals.
				</p>
				<div class="flex flex-col gap-3 pt-2">
					{#each syncs as s (s)}
						<div
							class="flex w-fit items-center gap-3 rounded-2xl border border-white/50 bg-white/40 p-3
                     shadow-[0_8px_32px_0_rgba(79,70,229,0.08)] backdrop-blur-md"
						>
							<!-- {@html s.icon} --> <i class="ph-bold ph-graduation-cap text-xl text-white"></i>
							<span class="text-sm font-semibold text-[#111c2d]">{s.label}</span>
						</div>
					{/each}
				</div>
			</div>

			<!-- Right: floating stat cards -->
			<div class="relative h-80 sm:h-[360px]">
				<!-- Ambient -->
				<div
					class="pointer-events-none absolute top-1/2 right-1/4 h-32 w-32 rounded-full bg-[#3525cd]/20 blur-[32px]"
					aria-hidden="true"
				></div>

				<!-- Weekly streak — top right -->
				<div
					class="absolute top-0 right-0 flex w-44 flex-col gap-1 rounded-3xl p-6 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)]
                 sm:w-52"
					style="background: linear-gradient(135deg,#3525cd 0%,#4338ca 100%);"
				>
					<p class="text-[10px] tracking-[1px] text-white/70 uppercase">Weekly Streak</p>
					<p class="text-4xl leading-10 font-semibold text-white">5-Day 🔥</p>
				</div>

				<!-- OCR files — center -->
				<div
					class="absolute top-1/2 left-1/2 flex w-28 -translate-x-1/2 -translate-y-1/4 flex-col gap-1 rounded-3xl p-5
                 shadow-[0_4px_6px_-4px_rgba(0,0,0,0.1),0_10px_15px_-3px_rgba(0,0,0,0.1)]"
					style="background: linear-gradient(135deg,#006A61 0%,#0d9488 100%);"
				>
					<p class="text-[10px] tracking-[1px] text-white/80 uppercase">OCR Files</p>
					<p class="text-4xl font-semibold text-white">24</p>
				</div>

				<!-- Active modules — bottom left -->
				<div
					class="absolute bottom-4 left-0 flex w-44 flex-col gap-1 rounded-3xl border border-white p-6 shadow-[0_8px_10px_-6px_rgba(0,0,0,0.1),0_20px_25px_-5px_rgba(0,0,0,0.1)]
                 backdrop-blur-md sm:w-52"
					style="background: linear-gradient(135deg,rgba(255,255,255,1) 0%,rgba(238,242,255,0.5) 100%);"
				>
					<p class="text-[10px] font-semibold tracking-[1px] text-[#464555] uppercase">
						Active Modules
					</p>
					<p class="text-5xl leading-[44px] font-semibold text-[#3525cd]">06</p>
				</div>
			</div>
		</div>
	</section>

	<!-- ============================================================
       CTA BANNER
       ============================================================ -->
	<section
		class="relative mx-2 my-4 overflow-hidden rounded-[40px] px-8 py-20 text-center shadow-[0_32px_64px_-16px_rgba(53,37,205,0.4)]
           sm:mx-4"
		style="background: #3525cd;"
	>
		<!-- Ambient -->
		<div
			class="pointer-events-none absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-white/10 opacity-60 blur-[60px]"
			aria-hidden="true"
		></div>
		<div
			class="pointer-events-none absolute -bottom-40 -left-40 h-[350px] w-[350px] rounded-full bg-black/5 opacity-60 blur-[50px]"
			aria-hidden="true"
		></div>

		<div class="relative mx-auto flex max-w-2xl flex-col items-center gap-5">
			<h2
				class="text-4xl leading-[1.2] font-bold text-white sm:text-5xl"
				style="font-family: 'Plus Jakarta Sans', sans-serif;"
			>
				Ready to unclutter<br />your learning journey?
			</h2>
			<p class="max-w-lg text-base leading-[1.65] text-white/80">
				Join 10,000+ students from across the globe who are upgrading their digital second brain
				today.
			</p>
			<div class="flex flex-wrap items-center justify-center gap-4 pt-2">
				<button
					class="rounded-2xl bg-white px-10 py-4 text-lg font-semibold text-[#3525cd]
                 transition-all hover:bg-white/90 active:scale-[0.98]"
				>
					Join SLO Today
				</button>
				<button
					class="rounded-2xl border border-white/30 px-8 py-4 text-lg font-semibold text-white
                 transition-all hover:bg-white/10 active:scale-[0.98]"
				>
					See Pricing
				</button>
			</div>
			<p class="pt-1 text-[11px] font-semibold tracking-[1.1px] text-white/40 uppercase">
				No credit card required • 3 modules free
			</p>
		</div>
	</section>

	<!-- ============================================================
       FOOTER
       ============================================================ -->
	<footer class="border-t border-[#c7c4d8]/10 bg-white px-6 py-12 sm:px-10">
		<div class="mx-auto grid max-w-7xl grid-cols-2 gap-8 sm:grid-cols-4">
			<!-- Brand -->
			<div class="col-span-2 flex flex-col gap-3 sm:col-span-1">
				<div class="flex items-center gap-2">
					<span class="flex h-7 w-7 items-center justify-center rounded-lg bg-[#3525cd]">
						<svg
							viewBox="0 0 24 24"
							fill="none"
							stroke="white"
							stroke-width="2.5"
							class="h-3.5 w-3.5"
						>
							<path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path
								d="M2 12l10 5 10-5"
							/>
						</svg>
					</span>
					<span class="text-lg font-semibold text-[#3525cd]">SLO</span>
				</div>
				<p class="text-sm leading-[1.65] text-[#464555]/70">
					Smarter organization for higher potential.
				</p>
				<p class="text-[10px] text-[#464555]/40">© 2024 Smart Lecture Organizer.</p>
			</div>

			<!-- Product -->
			<div class="flex flex-col gap-5">
				<p class="text-[11px] font-semibold tracking-[2.2px] text-[#111c2d] uppercase">Product</p>
				<div class="flex flex-col gap-2">
					{#each ['Features', 'Pricing', 'Changelog', 'Roadmap'] as l (l)}
						<a href={resolve('/')} class="text-sm text-[#464555] transition-colors hover:text-[#3525cd]">{l}</a
						>
					{/each}
				</div>
			</div>

			<!-- Support -->
			<div class="flex flex-col gap-5">
				<p class="text-[11px] font-semibold tracking-[2.2px] text-[#111c2d] uppercase">Support</p>
				<div class="flex flex-col gap-2">
					{#each ['Help Center', 'Contact', 'Privacy', 'Terms'] as l (l)}
						<a href={resolve('/')} class="text-sm text-[#464555] transition-colors hover:text-[#3525cd]">{l}</a
						>
					{/each}
				</div>
			</div>

			<!-- Connect -->
			<div class="flex flex-col gap-5">
				<p class="text-[11px] font-semibold tracking-[2.2px] text-[#111c2d] uppercase">Connect</p>
				<div class="flex gap-3">
					<!-- Twitter/X -->
					<a
						href={resolve('/')}
						class="flex h-9 w-9 items-center justify-center rounded-xl bg-[#e7eeff] transition-colors hover:bg-[#3525cd]/20"
						aria-label="Twitter"
					>
						<svg viewBox="0 0 24 24" fill="#3525cd" class="h-4 w-4">
							<path
								d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
							/>
						</svg>
					</a>
					<!-- LinkedIn -->
					<a
						href={resolve('/')}
						class="flex h-9 w-9 items-center justify-center rounded-xl bg-[#e7eeff] transition-colors hover:bg-[#3525cd]/20"
						aria-label="LinkedIn"
					>
						<svg viewBox="0 0 24 24" fill="#3525cd" class="h-4 w-4">
							<path
								d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"
							/><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" />
						</svg>
					</a>
				</div>
			</div>
		</div>
	</footer>
</main>
