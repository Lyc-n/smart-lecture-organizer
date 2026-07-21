<script lang="ts">
	import { page, navigating } from '$app/stores';
	import { goto } from '$app/navigation';
	import { invalidate } from '$app/navigation';
	import Icon from '$lib/components/atoms/Icon.svelte';
	import GroupCard from '$lib/components/organisms/GroupCard.svelte';
	import GroupForm from '$lib/components/organisms/GroupForm.svelte';
	import ItemCard from '$lib/components/organisms/ItemCard.svelte';
	import { api } from '$lib/utils/api';
	import { toast } from '$lib/stores/toast';

	const group = $derived($page.data.group);
	const children = $derived($page.data.children ?? []);
	const groupItems = $derived($page.data.items ?? []);
	const recommendations = $derived($page.data.recommendations ?? []);

	let showForm = $state(false);
	let prefillName = $state('');
	let deleting = $state(false);
	let viewMode = $state<'grid' | 'list'>('grid');
	let sortBy = $state<'created_at' | 'file_size' | 'type'>('created_at');

	$effect(() => {
		if (group?.id) {
			fetch('/api/recent-access', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ group_id: group.id })
			});
		}
	});

	const sortedItems = $derived.by(() => {
		const items = [...groupItems];
		switch (sortBy) {
			case 'file_size':
				items.sort((a, b) => (b.fileSize ?? 0) - (a.fileSize ?? 0));
				break;
			case 'type':
				items.sort((a, b) => a.type.localeCompare(b.type));
				break;
			default:
				items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
		}
		return items;
	});

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
			toast.success('Grup berhasil dibuat');
			invalidate(() => true);
		} catch (e) {
			toast.error((e as Error).message);
		}
	}

	async function handleEdit(data: {
		name: string;
		subtitle: string;
		description: string;
		color: string;
		icon: string;
		parent_id: string | null;
	}) {
		try {
			await api.patch(`/api/groups/${group.id}`, data);
			showForm = false;
			prefillName = '';
			toast.success('Grup berhasil diperbarui');
			invalidate(() => true);
		} catch (e) {
			toast.error((e as Error).message);
		}
	}

	async function handleDelete() {
		if (!confirm('Hapus grup ini beserta semua sub-grup di dalamnya?')) return;
		deleting = true;
		try {
			await api.del(`/api/groups/${group.id}`);
			toast.success('Grup berhasil dihapus');
			goto('/app/groups');
		} catch (e) {
			toast.error((e as Error).message);
			deleting = false;
		}
	}
</script>

<svelte:head>
	<title>{group?.name ?? 'Grup'} — Smart Lecture Organizer</title>
</svelte:head>

{#if !group}
	<div class="min-h-screen bg-bg-surface text-text-base p-8">
		<div class="mx-auto max-w-2xl">
			<div class="flex flex-col gap-4">
				<div class="h-6 w-24 animate-pulse rounded bg-bg-hover"></div>
				<div class="h-32 animate-pulse rounded-xl bg-bg-elevated"></div>
				<div class="grid grid-cols-1 gap-2 sm:grid-cols-2">
					{#each [1, 2, 3, 4] as _}
						<div class="h-16 animate-pulse rounded-xl bg-bg-elevated"></div>
					{/each}
				</div>
			</div>
		</div>
	</div>
{:else}

<div class="min-h-screen bg-bg-surface text-text-base p-8">
	<div class="mx-auto max-w-2xl">
		<a
			href="/app/groups"
			class="mb-4 flex items-center gap-1 text-sm text-text-muted hover:text-text-secondary transition"
		>
			<svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
				<path d="M15 18l-6-6 6-6" />
			</svg>
			Kembali
		</a>

		<div class="rounded-xl bg-bg-elevated border border-border-main p-6">
			<div class="flex items-start gap-4">
				<div
					class="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl"
					style="background-color: {group.color}20"
				>
					<Icon name={group.icon} color={group.color} />
				</div>
				<div class="min-w-0 flex-1">
					<h1 class="text-xl font-bold">{group.name}</h1>
					{#if group.subtitle}
						<p class="text-sm text-text-secondary">{group.subtitle}</p>
					{/if}
					{#if group.description}
						<p class="mt-2 text-sm text-text-muted">{group.description}</p>
					{/if}
				</div>
				<div class="flex gap-2">
					<button
						type="button"
						onclick={() => (showForm = true)}
						class="rounded-lg border border-border-hover px-3 py-1.5 text-sm text-text-secondary transition hover:bg-bg-hover"
					>
						Edit
					</button>
					<button
						type="button"
						onclick={handleDelete}
						disabled={deleting}
						class="rounded-lg border border-danger px-3 py-1.5 text-sm text-danger transition hover:bg-danger disabled:opacity-50"
					>
						{deleting ? 'Menghapus...' : 'Hapus'}
					</button>
				</div>
			</div>
		</div>

		{#if recommendations.length > 0}
			<div class="mt-6 rounded-xl bg-bg-elevated border border-border-main p-4">
				<p class="mb-2 text-sm text-text-secondary">Grup yang disarankan:</p>
				<div class="flex flex-wrap gap-2">
					{#each recommendations as name (name)}
						<button
							type="button"
							onclick={() => handleRecommendation(name)}
							class="rounded-lg bg-primary/20 border border-primary/30 px-3 py-1.5 text-sm text-primary transition hover:bg-primary/30"
						>
							+ {name}
						</button>
					{/each}
				</div>
			</div>
		{/if}

		<section class="mt-6">
			<h2 class="mb-3 text-lg font-semibold">Sub-Grup</h2>
			{#if children.length === 0}
				<div class="rounded-xl bg-bg-elevated border border-border-main p-6 text-center text-sm text-text-muted">
					Belum ada sub-grup.
				</div>
			{:else}
				<div class="flex flex-col gap-2">
					{#each children as child (child.id)}
						<GroupCard
							group={child}
							href="/app/groups/{child.id}"
						/>
					{/each}
				</div>
			{/if}
		</section>

		<section class="mt-6">
			<div class="mb-3 flex items-center justify-between">
				<h2 class="text-lg font-semibold">Item</h2>
				<div class="flex items-center gap-2">
					<select
						bind:value={sortBy}
						class="rounded-lg border border-border-hover bg-bg-elevated px-2 py-1.5 text-xs text-text-secondary focus:outline-none"
					>
						<option value="created_at">Terbaru</option>
						<option value="file_size">Ukuran</option>
						<option value="type">Tipe</option>
					</select>
					<div class="flex rounded-lg border border-border-hover overflow-hidden">
						<button
							type="button"
							onclick={() => (viewMode = 'grid')}
							class="p-1.5 transition {viewMode === 'grid' ? 'bg-bg-hover text-text-secondary' : 'text-text-muted hover:text-text-secondary'}"
							aria-label="Grid view"
						>
							<svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" d="M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm10 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zm10 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
							</svg>
						</button>
						<button
							type="button"
							onclick={() => (viewMode = 'list')}
							class="p-1.5 transition {viewMode === 'list' ? 'bg-bg-hover text-text-secondary' : 'text-text-muted hover:text-text-secondary'}"
							aria-label="List view"
						>
							<svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
							</svg>
						</button>
					</div>
				</div>
			</div>

			{#if $navigating && groupItems.length === 0}
				<div class="grid grid-cols-1 gap-2 sm:grid-cols-2">
					{#each [1, 2, 3, 4] as _}
						<div class="h-16 animate-pulse rounded-xl bg-bg-elevated border border-border-main"></div>
					{/each}
				</div>
			{:else if sortedItems.length === 0}
				<div class="rounded-xl bg-bg-elevated border border-border-main p-6 text-center text-sm text-text-muted">
					Belum ada item di grup ini.
				</div>
			{:else if viewMode === 'grid'}
				<div class="grid grid-cols-1 gap-2 sm:grid-cols-2">
					{#each sortedItems as item (item.id)}
						<ItemCard {item} href="/app/items/{item.id}" />
					{/each}
				</div>
			{:else}
				<div class="flex flex-col gap-2">
					{#each sortedItems as item (item.id)}
						<ItemCard {item} href="/app/items/{item.id}" />
					{/each}
				</div>
			{/if}
		</section>
	</div>
</div>

{#if showForm}
	<GroupForm
		groups={$page.data.groups ?? []}
		group={prefillName ? undefined : { ...group, parentId: group.parentId }}
		prefillName={prefillName}
		onsubmit={prefillName ? handleCreate : handleEdit}
		oncancel={() => { showForm = false; prefillName = ''; }}
	/>
{/if}
{/if}
