import { writable } from 'svelte/store';

export type ToastVariant = 'success' | 'error' | 'warning' | 'info';

interface ToastState {
	message: string;
	variant: ToastVariant;
	open: boolean;
}

function createToastStore() {
	const { subscribe, set, update } = writable<ToastState>({
		message: '',
		variant: 'info',
		open: false
	});

	let timer: ReturnType<typeof setTimeout> | null = null;

	function show(message: string, variant: ToastVariant = 'info', duration = 3000) {
		if (timer) clearTimeout(timer);

		set({ message, variant, open: true });

		if (duration > 0) {
			timer = setTimeout(() => {
				update((s) => ({ ...s, open: false }));
			}, duration);
		}
	}

	function dismiss() {
		if (timer) clearTimeout(timer);
		update((s) => ({ ...s, open: false }));
	}

	return {
		subscribe,
		success: (message: string, duration?: number) => show(message, 'success', duration),
		error: (message: string, duration?: number) => show(message, 'error', duration ?? 5000),
		warning: (message: string, duration?: number) => show(message, 'warning', duration),
		info: (message: string, duration?: number) => show(message, 'info', duration),
		dismiss
	};
}

export const toast = createToastStore();
