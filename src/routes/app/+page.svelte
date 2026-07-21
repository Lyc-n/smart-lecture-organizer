<script lang="ts">
	import { page } from '$app/stores';
	import ItemCard from '$lib/components/organisms/ItemCard.svelte';
	import { formatDateTime } from '$lib/utils/format';

	const pinnedItems = $derived($page.data.pinnedItems ?? []);
	const groupCount = $derived($page.data.groupCount ?? 0);
	const recentAccess = $derived($page.data.recentAccess ?? []);
	const tasksPending = $derived($page.data.tasksPending ?? 0);
	const tasksOverdue = $derived($page.data.tasksOverdue ?? 0);
	const loaded = $derived($page.data.groupCount !== undefined);
</script>

<svelte:head>
	<title>Dashboard — Smart Lecture Organizer</title>
</svelte:head>

<div class="min-h-screen bg-bg-surface text-text-base p-8">
	<div class="mx-auto max-w-2xl">
		<h1 class="mb-6 text-2xl font-bold">Dashboard</h1>

		{#if !loaded}
			<div class="flex flex-col gap-4">
				<div class="h-6 w-24 animate-pulse rounded bg-bg-hover"></div>
				<div class="space-y-2">
					{#each [1, 2, 3] as _}
						<div class="h-14 animate-pulse rounded-xl bg-bg-elevated"></div>
					{/each}
				</div>
				<div class="grid grid-cols-3 gap-3">
					{#each [1, 2, 3] as _}
						<div class="h-20 animate-pulse rounded-xl bg-bg-elevated"></div>
					{/each}
				</div>
			</div>
		{:else}
			<div class="flex flex-col gap-4">
				{#if pinnedItems.length > 0}
					<section>
						<h2 class="mb-3 text-sm font-semibold text-text-secondary uppercase tracking-wider">Disematkan</h2>
						<div class="flex flex-col gap-2">
							{#each pinnedItems as item (item.id)}
								<ItemCard {item} href="/app/items/{item.id}" />
							{/each}
						</div>
					</section>
				{/if}

				{#if recentAccess.length > 0}
					<section>
						<h2 class="mb-3 text-sm font-semibold text-text-secondary uppercase tracking-wider">Terakhir Dilihat</h2>
						<div class="flex flex-col gap-2">
							{#each recentAccess as ra (ra.id)}
								{#if ra.itemId}
									<a
										href="/app/items/{ra.itemId}"
										class="flex items-center gap-3 rounded-xl bg-bg-elevated border border-border-main p-3 text-left transition hover:border-border-hover"
									>
										<div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-bg-hover text-text-muted">
											<svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
												<path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
											</svg>
										</div>
										<div class="min-w-0 flex-1">
											<div class="truncate text-sm text-text-base">{ra.itemName}</div>
											<div class="text-xs text-text-muted">{formatDateTime(ra.accessedAt)}</div>
										</div>
									</a>
								{:else if ra.groupId}
									<a
										href="/app/groups/{ra.groupId}"
										class="flex items-center gap-3 rounded-xl bg-bg-elevated border border-border-main p-3 text-left transition hover:border-border-hover"
									>
										<div
											class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
											style="background-color: {ra.groupColor}20"
										>
											<svg class="h-4 w-4" fill="none" stroke={ra.groupColor} stroke-width="1.5" viewBox="0 0 24 24">
												<path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
											</svg>
										</div>
										<div class="min-w-0 flex-1">
											<div class="truncate text-sm text-text-base">{ra.groupName}</div>
											<div class="text-xs text-text-muted">{formatDateTime(ra.accessedAt)}</div>
										</div>
									</a>
								{/if}
							{/each}
						</div>
					</section>
				{/if}

				<section>
					<h2 class="mb-3 text-sm font-semibold text-text-secondary uppercase tracking-wider">Ringkasan</h2>
					<div class="grid grid-cols-3 gap-3">
						<a
							href="/app/groups"
							class="rounded-xl bg-bg-elevated border border-border-main p-4 text-left transition hover:border-border-hover"
						>
							<div class="text-2xl font-bold">{groupCount}</div>
							<div class="text-xs text-text-muted">Grup</div>
						</a>
						<a
							href="/app/tasks?status=pending"
							class="rounded-xl bg-bg-elevated border border-border-main p-4 text-left transition hover:border-border-hover"
						>
							<div class="text-2xl font-bold">{tasksPending}</div>
							<div class="text-xs text-text-muted">Tugas</div>
						</a>
						<a
							href="/app/tasks?status=overdue"
							class="rounded-xl bg-bg-elevated border border-border-main p-4 text-left transition hover:border-border-hover"
						>
							<div class="text-2xl font-bold text-danger">{tasksOverdue}</div>
							<div class="text-xs text-text-muted">Terlambat</div>
						</a>
					</div>
				</section>

				<section>
					<h2 class="mb-3 text-sm font-semibold text-text-secondary uppercase tracking-wider">Akses Cepat</h2>
					<div class="flex flex-col gap-2">
						<a
							href="/app/groups"
							class="flex items-center gap-3 rounded-xl bg-bg-elevated border border-border-main p-3 text-left transition hover:border-border-hover"
						>
							<div class="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
								<svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
									<path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
								</svg>
							</div>
							<div>
								<div class="text-sm font-medium text-text-base">Buat Grup</div>
								<div class="text-xs text-text-muted">Buat grup belajar baru</div>
							</div>
						</a>
						<a
							href="/app/items/upload"
							class="flex items-center gap-3 rounded-xl bg-bg-elevated border border-border-main p-3 text-left transition hover:border-border-hover"
						>
							<div class="flex h-9 w-9 items-center justify-center rounded-lg bg-success/10 text-success">
								<svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.348-1.1 3.75 3.75 0 014.157 4.157A4.5 4.5 0 0117.25 19.5H6.75z" />
								</svg>
							</div>
							<div>
								<div class="text-sm font-medium text-text-base">Upload Materi</div>
								<div class="text-xs text-text-muted">Unggah file materi baru</div>
							</div>
						</a>
						<a
							href="/app/tasks"
							class="flex items-center gap-3 rounded-xl bg-bg-elevated border border-border-main p-3 text-left transition hover:border-border-hover"
						>
							<div class="flex h-9 w-9 items-center justify-center rounded-lg bg-tertiary/10 text-tertiary">
								<svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
								</svg>
							</div>
							<div>
								<div class="text-sm font-medium text-text-base">Buat Tugas</div>
								<div class="text-xs text-text-muted">Buat tugas baru</div>
							</div>
						</a>
						<a
							href="/app/bookmarks"
							class="flex items-center gap-3 rounded-xl bg-bg-elevated border border-border-main p-3 text-left transition hover:border-border-hover"
						>
							<div class="flex h-9 w-9 items-center justify-center rounded-lg bg-rose-500/10 text-rose-400">
								<svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
								</svg>
							</div>
							<div>
								<div class="text-sm font-medium text-text-base">Bookmark</div>
								<div class="text-xs text-text-muted">Item dan grup yang dibookmark</div>
							</div>
						</a>
					</div>
				</section>
			</div>
		{/if}
	</div>
</div>
