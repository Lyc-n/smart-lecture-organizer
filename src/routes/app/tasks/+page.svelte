<script lang="ts">
	import { page, navigating } from '$app/stores';
	import { goto } from '$app/navigation';
	import { invalidate } from '$app/navigation';
	import TaskCard from '$lib/components/organisms/TaskCard.svelte';
	import TaskForm from '$lib/components/organisms/TaskForm.svelte';
	import { api } from '$lib/utils/api';

	const dataTasks = $derived($page.data.tasks ?? []);
	const dataGroups = $derived($page.data.groups ?? []);
	const dataItems = $derived($page.data.items ?? []);
	const overdueCount = $derived($page.data.overdueCount ?? 0);

	const currentStatus = $derived(($page.url.searchParams.get('status') ?? 'all'));
	const currentGroupId = $derived(($page.url.searchParams.get('groupId') ?? ''));

	function setFilter(params: Record<string, string | undefined>) {
		const url = new URL($page.url);
		for (const [key, val] of Object.entries(params)) {
			if (val) {
				url.searchParams.set(key, val);
			} else {
				url.searchParams.delete(key);
			}
		}
		goto(url, { replaceState: true });
	}

	let showForm = $state(false);
	let editingTask: object | null = $state(null);

	const groupNames = $derived(
		Object.fromEntries(dataGroups.map((g: { id: string; name: string }) => [g.id, g.name]))
	);

	function buildFilterUrl(fields: Record<string, string | null>): string {
		const params = new URLSearchParams();
		const status = fields.status ?? currentStatus;
		const groupId = fields.groupId ?? currentGroupId;
		if (status !== 'all') params.set('status', status);
		if (groupId) params.set('groupId', groupId);
		const qs = params.toString();
		return `/app/tasks${qs ? `?${qs}` : ''}`;
	}

	async function handleCreate(data: {
		title: string;
		description: string | null;
		deadline: string | null;
		group_id: string | null;
		item_id: string | null;
	}) {
		try {
			await api.post('/api/tasks', data);
			showForm = false;
			invalidate(() => true);
		} catch (e) {
			alert((e as Error).message);
		}
	}

	async function handleEdit(data: {
		title: string;
		description: string | null;
		deadline: string | null;
		group_id: string | null;
		item_id: string | null;
	}) {
		if (!editingTask) return;
		try {
			await api.patch(`/api/tasks/${(editingTask as { id: string }).id}`, data);
			editingTask = null;
			invalidate(() => true);
		} catch (e) {
			alert((e as Error).message);
		}
	}

	function openEdit(task: object) {
		editingTask = task;
	}
</script>

<svelte:head>
	<title>Tugas — Smart Lecture Organizer</title>
</svelte:head>

<div class="min-h-screen bg-bg-surface text-text-base p-8">
	<div class="mx-auto max-w-2xl">
		<div class="mb-6 flex items-center justify-between">
			<h1 class="text-2xl font-bold">Tugas</h1>
			<button
				type="button"
				onclick={() => (showForm = true)}
				class="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-primary-hover"
			>
				Tambah Tugas
			</button>
		</div>

		<div class="mb-4 flex flex-wrap items-center gap-2">
			<button
				type="button"
				onclick={() => setFilter({ status: undefined, groupId: undefined })}
				class="rounded-lg px-3 py-1.5 text-sm transition {currentStatus === 'all' ? 'bg-primary text-white' : 'bg-bg-hover text-text-secondary hover:text-text-secondary'}"
			>
				Semua
			</button>
			<button
				type="button"
				onclick={() => setFilter({ status: 'pending' })}
				class="rounded-lg px-3 py-1.5 text-sm transition {currentStatus === 'pending' ? 'bg-primary text-white' : 'bg-bg-hover text-text-secondary hover:text-text-secondary'}"
			>
				Pending
			</button>
			<button
				type="button"
				onclick={() => setFilter({ status: 'completed' })}
				class="rounded-lg px-3 py-1.5 text-sm transition {currentStatus === 'completed' ? 'bg-primary text-white' : 'bg-bg-hover text-text-secondary hover:text-text-secondary'}"
			>
				Selesai
			</button>
			<button
				type="button"
				onclick={() => setFilter({ status: 'overdue' })}
				class="relative rounded-lg px-3 py-1.5 text-sm transition {currentStatus === 'overdue' ? 'bg-danger text-white' : 'bg-bg-hover text-text-secondary hover:text-text-secondary'}"
			>
				Terlambat
				{#if overdueCount > 0 && currentStatus !== 'overdue'}
					<span class="absolute -right-1.5 -top-1.5 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-danger px-1 text-xs font-bold text-white">
						{overdueCount}
					</span>
				{/if}
			</button>

			<div class="ml-auto">
				<select
					value={currentGroupId}
					onchange={(e) => {
						const val = (e.target as HTMLSelectElement).value;
						setFilter({ groupId: val || undefined });
					}}
					class="rounded-lg border border-border-hover bg-bg-elevated px-2 py-1.5 text-xs text-text-secondary focus:outline-none"
				>
					<option value="">Semua Grup</option>
					{#each dataGroups as g}
						<option value={g.id}>{g.name}</option>
					{/each}
				</select>
			</div>
		</div>

		{#if $navigating && dataTasks.length === 0}
			<div class="flex flex-col gap-2">
				{#each [1, 2, 3, 4] as _}
					<div class="h-16 animate-pulse rounded-xl bg-bg-elevated border border-border-main"></div>
				{/each}
			</div>
		{:else if dataTasks.length === 0}
			<div class="rounded-xl bg-bg-elevated border border-border-main p-8 text-center">
				<div
					class="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-bg-hover"
				>
					<svg class="h-7 w-7 text-text-muted" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
					</svg>
				</div>
				<p class="text-text-secondary">Belum ada tugas.</p>
			</div>
		{:else}
			<div class="flex flex-col gap-2">
				{#each dataTasks as taskItem (taskItem.id)}
					<TaskCard
						task={taskItem}
						groupName={groupNames[taskItem.groupId ?? ''] ?? ''}
						onclick={() => openEdit(taskItem)}
						onupdate={() => invalidate(() => true)}
					/>
				{/each}
			</div>
		{/if}
	</div>
</div>

{#if showForm}
	<TaskForm
		groups={dataGroups}
		items={dataItems}
		onsubmit={handleCreate}
		oncancel={() => (showForm = false)}
	/>
{/if}

{#if editingTask}
	<TaskForm
		task={editingTask as {
			id: string;
			title: string;
			description: string | null;
			deadline: string | null;
			groupId: string | null;
			itemId: string | null;
		}}
		groups={dataGroups}
		items={dataItems}
		onsubmit={handleEdit}
		oncancel={() => (editingTask = null)}
	/>
{/if}
