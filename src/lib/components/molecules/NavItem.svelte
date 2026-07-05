<script lang="ts">
	import SquaresFourIcon from 'phosphor-svelte/lib/SquaresFourIcon';
	import FolderIcon from 'phosphor-svelte/lib/FolderIcon';
	import ListChecksIcon from 'phosphor-svelte/lib/ListChecksIcon';
	import BookmarkIcon from 'phosphor-svelte/lib/BookmarkIcon';
	import MagnifyingGlassIcon from 'phosphor-svelte/lib/MagnifyingGlassIcon';
	import SignOutIcon from 'phosphor-svelte/lib/SignOutIcon';
	import QuestionIcon from 'phosphor-svelte/lib/QuestionIcon';

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

	const variantStyles: Record<string, string> = {
		default: active
			? 'bg-primary/10 text-primary'
			: 'text-text-muted hover:bg-bg-hover hover:text-text-secondary',
		danger: 'text-danger hover:bg-danger/10',
		warning: 'text-tertiary hover:bg-tertiary/10'
	};
</script>

<button
	{type}
	{onclick}
	title={collapsed ? label : undefined}
	class="relative flex w-full items-center gap-3 rounded-lg {collapsed ? 'justify-center px-2 py-2.5' : 'px-3 py-2.5'} text-sm font-medium transition {variantStyles[variant]}"
>
	{#if icon === 'dashboard'}
		<SquaresFourIcon size={20} />
	{:else if icon === 'folder'}
		<FolderIcon size={20} />
	{:else if icon === 'tasks'}
		<ListChecksIcon size={20} />
	{:else if icon === 'bookmark'}
		<BookmarkIcon size={20} />
	{:else if icon === 'search'}
		<MagnifyingGlassIcon size={20} />
	{:else if icon === 'logout'}
		<SignOutIcon size={20} />
	{:else if icon === 'help'}
		<QuestionIcon size={20} />
	{/if}
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
