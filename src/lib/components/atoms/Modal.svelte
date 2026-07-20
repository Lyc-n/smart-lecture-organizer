<script lang="ts">
	import type { Snippet } from 'svelte';
	import Icon from '$lib/components/atoms/Icon.svelte';

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
		if (open && e.key === 'Escape') onclose?.();
	}
</script>

<svelte:window onkeydown={handleKeydown} />
{#if open}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
		onclick={handleBackdrop}
		role="dialog"
		aria-modal="true"
		tabindex="-1"
	>
		<div
			class="w-full max-w-lg rounded-2xl bg-bg-elevated border border-border-main p-6 shadow-2xl"
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
						<Icon name="close" size={20} />
					</button>
				</div>
			{/if}
			{#if children}{@render children()}{/if}
		</div>
	</div>
{/if}
