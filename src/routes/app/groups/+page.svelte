<script lang="ts">
	import { page, navigating } from '$app/stores';
	import { goto } from '$app/navigation';
	import { invalidate } from '$app/navigation';
	import GroupTree from '$lib/components/organisms/GroupTree.svelte';
	import GroupForm from '$lib/components/organisms/GroupForm.svelte';
	import { api } from '$lib/utils/api';

	const groups = $derived($page.data.groups ?? []);
	const recommendations = $derived($page.data.recommendations ?? []);

	let showForm = $state(false);
	let prefillName = $state('');

	function handleSelect(id: string) {
		goto(`/app/groups/${id}`);
	}

	function handleRecommendation(name: string) {
		prefillName = name;
		showForm = true;
	}

	async function handleCreate(data: {
		name: string;
		subtitle: string;
		description: string;
		color: string;
		icon: string;
		parent_id: string | null;
	}) {
		try {
			await api.post('/api/groups', data);
			showForm = false;
			prefillName = '';
			invalidate(() => true);
		} catch (e) {
			alert((e as Error).message);
		}
	}
</script>

<svelte:head>
	<title>Grup — Smart Lecture Organizer</title>
</svelte:head>

<div class="min-h-screen bg-slate-950 light:bg-slate-50 text-slate-100 light:text-slate-900 p-8">
	<div class="mx-auto max-w-2xl">
		<div class="mb-6 flex items-center justify-between">
			<h1 class="text-2xl font-bold">Grup</h1>
			<button
				type="button"
				onclick={() => (showForm = true)}
				class="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-500"
			>
				Buat Grup
			</button>
		</div>

		{#if recommendations.length > 0}
			<div class="mb-4 rounded-xl bg-slate-900 light:bg-white border border-slate-800 light:border-slate-200 p-4">
				<p class="mb-2 text-sm text-slate-400 light:text-slate-500">Grup yang disarankan:</p>
				<div class="flex flex-wrap gap-2">
					{#each recommendations as name (name)}
						<button
							type="button"
							onclick={() => handleRecommendation(name)}
							class="rounded-lg bg-indigo-600/20 border border-indigo-500/30 px-3 py-1.5 text-sm text-indigo-400 light:text-indigo-600 transition hover:bg-indigo-600/30"
						>
							+ {name}
						</button>
					{/each}
				</div>
			</div>
		{/if}

		{#if $navigating && groups.length === 0}
			<div class="space-y-3">
				{#each [1, 2, 3, 4] as _}
					<div class="h-16 animate-pulse rounded-xl bg-slate-900 light:bg-white border-slate-800 light:border-slate-200"></div>
				{/each}
			</div>
		{:else if groups.length === 0}
			<div class="rounded-xl bg-slate-900 light:bg-white border-slate-800 light:border-slate-200 p-8 text-center">
				<div
					class="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-800 light:bg-slate-100"
				>
					<svg class="h-7 w-7 text-slate-500" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
						<path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
					</svg>
				</div>
				<p class="text-slate-400 light:text-slate-500">Belum ada grup. Buat grup pertama untuk mulai mengatur materi belajar.</p>
			</div>
		{:else}
			<div class="rounded-xl bg-slate-900 light:bg-white border-slate-800 light:border-slate-200 p-4">
				<GroupTree {groups} onSelect={handleSelect} />
			</div>
		{/if}
	</div>
</div>

{#if showForm}
	<GroupForm
		groups={$page.data.groups ?? []}
		prefillName={prefillName}
		onsubmit={handleCreate}
		oncancel={() => { showForm = false; prefillName = ''; }}
	/>
{/if}
