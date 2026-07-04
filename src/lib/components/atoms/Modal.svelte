<script lang="ts">
	import type { Snippet } from 'svelte';
	import XIcon from 'phosphor-svelte/lib/XIcon';

	type Props = {
		open?: boolean;
		onclose?: () => void;
		title?: string;
		children?: Snippet;
	};

	let { open = false, onclose, title = '', children }: Props = $props();

	function handleBackdrop(e: MouseEvent) {
		if (e.target === e.currentTarget) onclose?.();
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') onclose?.();
	}
</script>

<svelte:window onkeydown={handleKeydown} />

{#if open}
	<!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
		onclick={handleBackdrop}
	>
		<div
			class="w-full max-w-lg rounded-2xl bg-slate-900 light:bg-white border border-slate-800 light:border-slate-200 p-6 shadow-2xl"
			role="dialog"
			aria-modal="true"
		>
			{#if title}
				<div class="mb-6 flex items-center justify-between">
					<h2 class="text-lg font-semibold text-slate-100 light:text-slate-900">{title}</h2>
					<button
						type="button"
						onclick={onclose}
						aria-label="Tutup"
						class="text-slate-500 light:text-slate-400 hover:text-slate-300 light:hover:text-slate-600"
					>
						<XIcon size={20} />
					</button>
				</div>
			{/if}
			{#if children}{@render children()}{/if}
		</div>
	</div>
{/if}
