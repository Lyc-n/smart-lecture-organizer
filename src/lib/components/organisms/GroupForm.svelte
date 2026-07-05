<script lang="ts">
	import Modal from '$lib/components/atoms/Modal.svelte';
	import Button from '$lib/components/atoms/Button.svelte';
	import Input from '$lib/components/atoms/Input.svelte';
	import Textarea from '$lib/components/atoms/Textarea.svelte';
	import Select from '$lib/components/atoms/Select.svelte';
	import FormField from '$lib/components/molecules/FormField.svelte';
	import ColorPicker from '$lib/components/molecules/ColorPicker.svelte';
	import IconPicker from '$lib/components/molecules/IconPicker.svelte';

	let {
		groups = [],
		group,
		prefillName = '',
		onsubmit,
		oncancel
	}: {
		groups?: Array<{ id: string; name: string; parentId: string | null }>;
		group?: {
			id: string;
			name: string;
			subtitle?: string | null;
			description?: string | null;
			color: string;
			icon: string;
			parentId?: string | null;
		};
		prefillName?: string;
		onsubmit: (data: {
			name: string;
			subtitle: string;
			description: string;
			color: string;
			icon: string;
			parent_id: string | null;
		}) => void;
		oncancel: () => void;
	} = $props();

	const _groupName = group?.name ?? prefillName;
	const _groupSubtitle = group?.subtitle ?? '';
	const _groupDescription = group?.description ?? '';
	const _groupColor = group?.color ?? '#6366f1';
	const _groupIcon = group?.icon ?? 'folder';
	const _groupParentId = group?.parentId ?? null;

	let name = $state(_groupName);
	let subtitle = $state(_groupSubtitle);
	let description = $state(_groupDescription);
	let color = $state(_groupColor);
	let icon = $state(_groupIcon);
	let parentId = $state(_groupParentId);

	let nameError = $state('');

	const availableParents = $derived(
		groups.filter((g) => {
			if (group && g.id === group.id) return false;
			if (group) {
				let current = g.id;
				while (current) {
					const p = groups.find((x) => x.id === current);
					if (!p) break;
					if (p.parentId === group.id) return false;
					current = p.parentId!;
				}
			}
			return true;
		})
	);

	const parentOptions = $derived(
		availableParents.map((g) => ({ value: g.id, label: g.name }))
	);

	function handleSubmit(e: Event) {
		e.preventDefault();
		if (!name.trim()) {
			nameError = 'Nama grup wajib diisi';
			return;
		}
		nameError = '';
		onsubmit({
			name: name.trim(),
			subtitle: subtitle.trim(),
			description: description.trim(),
			color,
			icon,
			parent_id: parentId
		});
	}
</script>

<Modal open={true} onclose={oncancel} title={group ? 'Edit Grup' : 'Buat Grup'}>
	<form onsubmit={handleSubmit} class="flex flex-col gap-5">
		<FormField label="Nama" id="name" error={nameError} required>
			<Input id="name" bind:value={name} placeholder="Nama grup" error={nameError} />
		</FormField>

		<FormField label="Subtitle" id="subtitle">
			<Input id="subtitle" bind:value={subtitle} placeholder="Subtitle opsional" />
		</FormField>

		<FormField label="Deskripsi" id="description">
			<Textarea id="description" bind:value={description} placeholder="Deskripsi opsional" />
		</FormField>

		<div>
			<span class="mb-2 block text-sm font-medium text-text-secondary">Warna</span>
			<ColorPicker bind:value={color} />
		</div>

		<div>
			<span class="mb-2 block text-sm font-medium text-text-secondary">Ikon</span>
			<IconPicker bind:value={icon} />
		</div>

		<FormField label="Grup Induk" id="parent">
			<Select
				id="parent"
				bind:value={parentId}
				options={parentOptions}
				placeholder="Tidak ada (grup utama)"
			/>
		</FormField>

		<div class="flex justify-end gap-3 pt-2">
			<Button variant="secondary" onclick={oncancel}>Batal</Button>
			<Button variant="primary" type="submit">{group ? 'Simpan' : 'Buat'}</Button>
		</div>
	</form>
</Modal>
