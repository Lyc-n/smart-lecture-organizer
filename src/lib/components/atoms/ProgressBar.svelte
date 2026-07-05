<script lang="ts">
	type Props = {
		value?: number;
		size?: 'sm' | 'md' | 'lg';
		class?: string;
	};

	let { value = 0, size = 'md', class: className = '' }: Props = $props();

	const sizes = { sm: 'h-1', md: 'h-2', lg: 'h-3' };

	const color = $derived(
		value >= 95 ? 'bg-danger' : value >= 80 ? 'bg-tertiary' : 'bg-primary'
	);
</script>

<div class="overflow-hidden rounded-full bg-bg-elevated {sizes[size]} {className}">
	<div
		class="h-full rounded-full transition-all duration-300 {color}"
		style="width: {Math.min(value, 100)}%"
	></div>
</div>
