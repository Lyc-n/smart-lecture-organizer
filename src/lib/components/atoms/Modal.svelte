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
			class="w-full max-w-lg rounded-2xl bg-bg-elevated border border-border-main p-6 shadow-2xl"
			role="dialog"
			aria-modal="true"
		>
			{#if title}
				<div class="mb-6 flex items-center justify-between">
					<h2 class="text-lg font-semibold text-text-base">{title}</h2>
					<button
						type="button"
						onclick={onclose}
						aria-label="Tutup"
						class="text-text-muted hover:text-text-secondary"
					>
						<XIcon size={20} />
					</button>
				</div>
			{/if}
			{#if children}{@render children()}{/if}
		</div>
	</div>
{/if}
