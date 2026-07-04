<script lang="ts">
	type Props = {
		value?: number;
		size?: 'sm' | 'md' | 'lg';
		class?: string;
	};

	let { value = 0, size = 'md', class: className = '' }: Props = $props();

	const sizes = { sm: 'h-1', md: 'h-2', lg: 'h-3' };

	const color = $derived(
		value >= 95 ? 'bg-red-500' : value >= 80 ? 'bg-amber-500' : 'bg-indigo-500'
	);
</script>

<div class="overflow-hidden rounded-full bg-slate-800 light:bg-slate-200 {sizes[size]} {className}">
	<div
		class="h-full rounded-full transition-all duration-300 {color}"
		style="width: {Math.min(value, 100)}%"
	></div>
</div>
