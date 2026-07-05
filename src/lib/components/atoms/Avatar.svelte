<script lang="ts">
	type Props = {
		name?: string;
		size?: 'sm' | 'md' | 'lg';
		class?: string;
	};

	let { name = '', size = 'md', class: className = '' }: Props = $props();

	const sizes = { sm: 'h-6 w-6 text-xs', md: 'h-7 w-7 text-xs', lg: 'h-9 w-9 text-sm' };
	const initial = $derived((name || '?').charAt(0).toUpperCase());
</script>

<div class="flex items-center justify-center rounded-full bg-primary font-medium text-white {sizes[size]} {className}">
	{initial}
</div>
