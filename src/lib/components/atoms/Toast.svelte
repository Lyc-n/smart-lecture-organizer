<script lang="ts">
	import { toast, type ToastVariant } from '$lib/stores/toast';

	let message = $state('');
	let variant = $state<ToastVariant>('info');
	let open = $state(false);

	$effect(() => {
		const unsub = toast.subscribe((state) => {
			message = state.message;
			variant = state.variant;
			open = state.open;
		});
		return unsub;
	});

	function dismiss() {
		toast.dismiss();
	}

	const variantStyles: Record<ToastVariant, { dot: string; border: string }> = {
		success: { dot: 'bg-success', border: 'border-success/30' },
		error: { dot: 'bg-danger', border: 'border-danger/30' },
		warning: { dot: 'bg-warning', border: 'border-warning/30' },
		info: { dot: 'bg-info', border: 'border-info/30' }
	};

	let styles = $derived(variantStyles[variant]);
</script>

{#if open}
	<div
		class="fixed top-4 right-4 z-50 flex items-center gap-3 rounded-xl border {styles.border} bg-bg-elevated px-4 py-3 shadow-lg transition-all duration-300"
		role="alert"
	>
		<span class="w-2 h-2 shrink-0 rounded-full {styles.dot}"></span>
		<span class="text-sm text-text-base">{message}</span>
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
