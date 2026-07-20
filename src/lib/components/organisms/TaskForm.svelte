<script lang="ts">
	import Modal from '$lib/components/atoms/Modal.svelte';
	import Button from '$lib/components/atoms/Button.svelte';
	import Input from '$lib/components/atoms/Input.svelte';
	import Textarea from '$lib/components/atoms/Textarea.svelte';
	import Select from '$lib/components/atoms/Select.svelte';
	import FormField from '$lib/components/molecules/FormField.svelte';

	let {
		task,
		groups = [],
		items = [],
		onsubmit,
		oncancel
	}: {
		task?: {
			id: string;
			title: string;
			description?: string | null;
			deadline?: string | null;
			groupId?: string | null;
			itemId?: string | null;
		};
		groups?: Array<{ id: string; name: string }>;
		items?: Array<{ id: string; name: string }>;
		onsubmit: (data: {
			title: string;
			description: string | null;
			deadline: string | null;
			group_id: string | null;
			item_id: string | null;
		}) => void;
		oncancel: () => void;
	} = $props();

	let title = $state('');
	let description = $state('');
	let deadline = $state('');
	let groupId = $state<string | null>(null);
	let itemId = $state<string | null>(null);

	$effect(() => {
		title = task?.title ?? '';
		description = task?.description ?? '';
		deadline = task?.deadline ? task.deadline.slice(0, 16) : '';
		groupId = task?.groupId ?? null;
		itemId = task?.itemId ?? null;
	});

	let titleError = $state('');

	const groupOptions = $derived(groups.map((g) => ({ value: g.id, label: g.name })));
	const itemOptions = $derived(items.map((i) => ({ value: i.id, label: i.name })));

	function handleSubmit(e: Event) {
		e.preventDefault();
		if (!title.trim()) {
			titleError = 'Judul tugas wajib diisi';
			return;
		}
		titleError = '';
		onsubmit({
			title: title.trim(),
			description: description.trim() || null,
			deadline: deadline ? new Date(deadline).toISOString() : null,
			group_id: groupId,
			item_id: itemId
		});
	}
</script>

<Modal open={true} onclose={oncancel} title={task ? 'Edit Tugas' : 'Tambah Tugas'}>
	<form onsubmit={handleSubmit} class="flex flex-col gap-5">
		<FormField label="Judul" id="title" error={titleError} required>
			<Input id="title" bind:value={title} placeholder="Nama tugas" error={titleError} />
		</FormField>

		<FormField label="Deskripsi" id="description">
			<Textarea id="description" bind:value={description} placeholder="Deskripsi opsional" />
		</FormField>

		<FormField label="Tenggat Waktu" id="deadline">
			<Input id="deadline" type="datetime-local" bind:value={deadline} />
		</FormField>

		<FormField label="Grup" id="group">
			<Select id="group" bind:value={groupId} options={groupOptions} placeholder="Tidak ada grup" />
		</FormField>

		<FormField label="Item" id="item">
			<Select id="item" bind:value={itemId} options={itemOptions} placeholder="Tidak ada item" />
		</FormField>

		<div class="flex justify-end gap-3 pt-2">
			<Button variant="secondary" onclick={oncancel}>Batal</Button>
			<Button variant="primary" type="submit">{task ? 'Simpan' : 'Tambah'}</Button>
		</div>
	</form>
</Modal>
