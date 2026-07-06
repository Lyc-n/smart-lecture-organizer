<script lang="ts">
	import Icon from '$lib/components/atoms/Icon.svelte';

	type Props = {
		label: string;
		icon: string;
		path?: string;
		active?: boolean;
		badge?: number;
		collapsed?: boolean;
		variant?: 'default' | 'danger' | 'warning';
		type?: 'button' | 'submit';
		onclick?: () => void;
	};

	let {
		label,
		icon,
		path = '',
		active = false,
		badge = 0,
		collapsed = false,
		variant = 'default',
		type = 'button',
		onclick
	}: Props = $props();

	const variantStyles: Record<string, string> = $derived({
		default: active
			? 'bg-primary/10 text-primary'
			: 'text-text-muted hover:bg-bg-hover hover:text-text-secondary',
		danger: 'text-danger hover:bg-danger/10',
		warning: 'text-tertiary hover:bg-tertiary/10'
	});
</script>

<button
	{type}
	{onclick}
	title={collapsed ? label : undefined}
	class="relative flex w-full items-center gap-3 rounded-lg {collapsed ? 'justify-center px-2 py-2.5' : 'px-3 py-2.5'} text-sm font-medium transition {variantStyles[variant]}"
>
	<Icon name={icon} size={20} />
	{#if !collapsed}
		{label}
		{#if badge > 0}
			<span class="ml-auto flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-danger px-1 text-xs font-bold text-white">
				{badge}
			</span>
		{/if}
	{:else if badge > 0}
		<span class="absolute -right-0.5 -top-0.5 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-danger px-0.5 text-[10px] font-bold text-white">
			{badge}
		</span>
	{/if}
</button>
