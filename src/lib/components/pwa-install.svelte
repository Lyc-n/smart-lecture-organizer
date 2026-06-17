<script lang="ts">
	import { onMount } from 'svelte';

	let deferredPrompt: any = $state(null);
	let show = $state(false);

	onMount(() => {
		window.addEventListener('beforeinstallprompt', (e) => {
			e.preventDefault();
			deferredPrompt = e;
			show = true;
		});

		window.addEventListener('appinstalled', () => {
			show = false;
			deferredPrompt = null;
		});
	});

	async function install() {
		if (!deferredPrompt) return;
		deferredPrompt.prompt();
		const result = await deferredPrompt.userChoice;
		if (result.outcome === 'accepted') {
			show = false;
		}
		deferredPrompt = null;
	}

	function dismiss() {
		show = false;
		deferredPrompt = null;
	}
</script>

{#if show}
	<div
		class="fixed bottom-4 left-4 z-50 flex items-center gap-3 rounded-xl bg-slate-800 px-4 py-3 text-white shadow-lg"
		role="alert"
	>
		<p class="text-sm font-medium">Install the app for offline use</p>
		<div class="flex gap-2">
			<button
				onclick={install}
				class="rounded-lg bg-blue-600 px-3 py-1 text-xs font-semibold hover:bg-blue-500"
			>
				Install
			</button>
			<button
				onclick={dismiss}
				class="rounded-lg px-2 py-1 text-xs text-white/70 hover:text-white"
			>
				Not now
			</button>
		</div>
	</div>
{/if}
