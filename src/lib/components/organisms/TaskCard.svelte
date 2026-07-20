<script lang="ts">
	import { api } from '$lib/utils/api';
	import Checkbox from '$lib/components/atoms/Checkbox.svelte';
	import Badge from '$lib/components/atoms/Badge.svelte';

	type Task = {
		id: string;
		title: string;
		description: string | null;
		deadline: string | null;
		isCompleted: boolean;
		createdAt: string | Date;
		groupId: string | null;
		itemId: string | null;
	};

	let {
		task,
		groupName,
		onclick,
		onupdate
	}: {
		task: Task;
		groupName?: string;
		onclick?: () => void;
		onupdate?: () => void;
	} = $props();

	let completed = $state(false);

	$effect(() => { completed = task.isCompleted; });

	async function toggle() {
		try {
			await api.patch(`/api/tasks/${task.id}`, { is_completed: !completed });
			completed = !completed;
			onupdate?.();
		} catch (e) {
			console.error('Failed to toggle task:', e);
		}
	}

	function deadlineLabel(deadline: string | null): { text: string; urgent: boolean; overdue: boolean } {
		if (!deadline) return { text: '', urgent: false, overdue: false };

		const now = new Date();
		const due = new Date(deadline);
		const diff = due.getTime() - now.getTime();
		const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

		if (days < 0) {
			const d = Math.abs(days);
			return { text: `Terlambat ${d} hr`, urgent: true, overdue: true };
		}
		if (days === 0) return { text: 'Hari ini', urgent: true, overdue: false };
		if (days === 1) return { text: 'Besok', urgent: true, overdue: false };
		if (days <= 7) return { text: `${days} hr lagi`, urgent: false, overdue: false };
		return { text: `${days} hr lagi`, urgent: false, overdue: false };
	}

	const dl = $derived(deadlineLabel(task.deadline));
</script>

<div
	class="flex cursor-pointer items-start gap-3 rounded-xl bg-bg-elevated border border-border-main p-3 transition hover:border-border-hover {task.isCompleted ? 'opacity-60' : ''}"
	onclick={onclick}
	onkeydown={(e) => e.key === 'Enter' && onclick?.()}
	role="button"
	tabindex="0"
>
	<Checkbox bind:checked={completed} onchange={toggle} />

	<div class="min-w-0 flex-1">
		<div class="flex items-center gap-2">
			<p class="truncate text-sm font-medium {completed ? 'text-text-muted line-through' : 'text-text-base'}">
				{task.title}
			</p>
			{#if groupName}
				<Badge>{groupName}</Badge>
			{/if}
		</div>

		{#if task.description}
			<p class="mt-1 truncate text-xs text-text-muted">{task.description}</p>
		{/if}

		{#if dl.text}
			<p class="mt-1 text-xs {dl.overdue ? 'text-danger' : dl.urgent ? 'text-tertiary' : 'text-text-muted'}">
				{dl.text}
			</p>
		{/if}
	</div>
</div>
