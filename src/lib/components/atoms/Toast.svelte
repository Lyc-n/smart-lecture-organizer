<script lang="ts">
	import type { Snippet } from 'svelte';

	type Props = {
		open?: boolean;
		message?: string;
		duration?: number;
		action?: Snippet;
		onclose?: () => void;
	};

	let {
		open = $bindable(false),
		message = '',
		duration = 6000,
		action,
		onclose
	}: Props = $props();

	let timer: ReturnType<typeof setTimeout> | null = null;

	function startTimer() {
		if (timer) clearTimeout(timer);
		if (duration > 0 && open) {
			timer = setTimeout(() => {
				open = false;
				onclose?.();
			}, duration);
		}
	}

	function dismiss() {
		if (timer) clearTimeout(timer);
		open = false;
		onclose?.();
	}

	$effect(() => {
		if (open) startTimer();
		return () => { if (timer) clearTimeout(timer); };
	});
</script>

{#if open}
	<div
		class="fixed top-4 right-4 z-50 flex items-center gap-3 rounded-xl border border-border-main bg-bg-elevated px-4 py-3 shadow-lg transition-all duration-300"
		role="alert"
	>
		<span class="w-2 h-2 shrink-0 rounded-full bg-success"></span>
		<span class="text-sm text-text-base">{message}</span>
		{#if action}
			<div>
				{@render action()}
			</div>
		{/if}
		<button
			type="button"
			onclick={dismiss}
			class="ml-2 shrink-0 rounded-md p-1 text-text-muted transition hover:text-text-secondary"
			aria-label="Tutup"
		>
			<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
			</svg>
		</button>
	</div>
{/if}
