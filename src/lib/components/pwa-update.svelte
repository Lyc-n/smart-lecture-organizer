<script lang="ts">
	import { useRegisterSW } from 'virtual:pwa-register/svelte';
	import { browser } from '$app/environment';

	let show = $state(false);

	const sw = browser
		? useRegisterSW({
				onNeedRefresh() {
					show = true;
				},
				onOfflineReady() {
					show = false;
				}
			})
		: null;

	function update() {
		sw?.updateServiceWorker();
		show = false;
	}

	function dismiss() {
		show = false;
	}
</script>

{#if show}
	<div
		class="fixed bottom-4 right-4 z-50 flex items-center gap-3 rounded-xl bg-blue-600 px-4 py-3 text-white shadow-lg"
		role="alert"
	>
		<p class="text-sm font-medium">New version available</p>
		<div class="flex gap-2">
			<button
				onclick={update}
				class="rounded-lg bg-white/20 px-3 py-1 text-xs font-semibold hover:bg-white/30"
			>
				Update
			</button>
			<button
				onclick={dismiss}
				class="rounded-lg px-2 py-1 text-xs text-white/70 hover:text-white"
			>
				Dismiss
			</button>
		</div>
	</div>
{/if}
