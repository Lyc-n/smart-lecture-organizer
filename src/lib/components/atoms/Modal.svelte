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

	let dialogEl: HTMLDivElement | null = $state(null);
	let previousFocus: HTMLElement | null = null;

	function getFocusables(): HTMLElement[] {
		if (!dialogEl) return [];
		return Array.from(
			dialogEl.querySelectorAll<HTMLElement>(
				'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
			)
		).filter((el) => !(el as HTMLInputElement).disabled && el.tabIndex >= 0);
	}

	function handleKeydown(e: KeyboardEvent) {
		if (!open) return;

		if (e.key === 'Escape') {
			e.preventDefault();
			onclose?.();
			return;
		}

		if (e.key === 'Tab') {
			const focusables = getFocusables();
			if (focusables.length === 0) return;

			const first = focusables[0];
			const last = focusables[focusables.length - 1];

			if (e.shiftKey) {
				if (document.activeElement === first) {
					e.preventDefault();
					last.focus();
				}
			} else {
				if (document.activeElement === last) {
					e.preventDefault();
					first.focus();
				}
			}
		}
	}

	function handleBackdrop(e: MouseEvent) {
		if (e.target === e.currentTarget) onclose?.();
	}

	$effect(() => {
		if (open) {
			previousFocus = document.activeElement as HTMLElement;
			requestAnimationFrame(() => {
				const focusables = getFocusables();
				if (focusables.length > 0) {
					focusables[0].focus();
				} else if (dialogEl) {
					dialogEl.focus();
				}
			});
		} else if (previousFocus) {
			previousFocus.focus();
			previousFocus = null;
		}
	});
</script>

<svelte:window onkeydown={handleKeydown} />
{#if open}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<div
		bind:this={dialogEl}
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
		onclick={handleBackdrop}
		role="dialog"
		aria-modal="true"
		tabindex="-1"
	>
		<!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
		<div
			class="w-full max-w-lg rounded-2xl bg-bg-elevated border border-border-main p-6 shadow-2xl"
			onclick={(e) => e.stopPropagation()}
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
