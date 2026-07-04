<script lang="ts">
	type Props = {
		checked?: boolean;
		disabled?: boolean;
		onchange?: () => void;
		class?: string;
	};

	let {
		checked = $bindable(false),
		disabled = false,
		onchange,
		class: className = ''
	}: Props = $props();

	function toggle() {
		if (disabled) return;
		checked = !checked;
		onchange?.();
	}
</script>

<button
	type="button"
	role="checkbox"
	aria-checked={checked}
	{disabled}
	onclick={toggle}
	class="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition disabled:opacity-50 {checked ? 'border-emerald-500 bg-emerald-500' : 'border-slate-600 hover:border-slate-500'} {className}"
>
	{#if checked}
		<svg class="h-3 w-3 text-white" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24">
			<path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
		</svg>
	{/if}
</button>
