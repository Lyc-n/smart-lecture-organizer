<script lang="ts">
	import type { Snippet } from 'svelte';

	import FolderIcon from 'phosphor-svelte/lib/FolderIcon';
	import BookIcon from 'phosphor-svelte/lib/BookIcon';
	import GraduationCapIcon from 'phosphor-svelte/lib/GraduationCapIcon';
	import CalculatorIcon from 'phosphor-svelte/lib/CalculatorIcon';
	import FlaskIcon from 'phosphor-svelte/lib/FlaskIcon';
	import GlobeIcon from 'phosphor-svelte/lib/GlobeIcon';
	import MusicNotesIcon from 'phosphor-svelte/lib/MusicNotesIcon';
	import ImageIcon from 'phosphor-svelte/lib/ImageIcon';
	import FileTextIcon from 'phosphor-svelte/lib/FileTextIcon';
	import VideoIcon from 'phosphor-svelte/lib/VideoIcon';
	import CodeIcon from 'phosphor-svelte/lib/CodeIcon';
	import PenIcon from 'phosphor-svelte/lib/PenIcon';
	import ChartBarIcon from 'phosphor-svelte/lib/ChartBarIcon';
	import HeartIcon from 'phosphor-svelte/lib/HeartIcon';
	import StarIcon from 'phosphor-svelte/lib/StarIcon';
	import ArchiveIcon from 'phosphor-svelte/lib/ArchiveIcon';
	import BriefcaseIcon from 'phosphor-svelte/lib/BriefcaseIcon';
	import CompassIcon from 'phosphor-svelte/lib/CompassIcon';
	import CpuIcon from 'phosphor-svelte/lib/CpuIcon';
	import DatabaseIcon from 'phosphor-svelte/lib/DatabaseIcon';

	type Props = {
		name?: string;
		size?: number | string;
		color?: string;
		weight?: 'thin' | 'light' | 'regular' | 'bold' | 'fill' | 'duotone';
		class?: string;
		children?: Snippet;
	};

	const ICON_MAP: Record<string, typeof FolderIcon> = {
		folder: FolderIcon,
		book: BookIcon,
		'graduation-cap': GraduationCapIcon,
		calculator: CalculatorIcon,
		flask: FlaskIcon,
		globe: GlobeIcon,
		music: MusicNotesIcon,
		image: ImageIcon,
		'file-text': FileTextIcon,
		video: VideoIcon,
		code: CodeIcon,
		'pen-tool': PenIcon,
		'bar-chart': ChartBarIcon,
		heart: HeartIcon,
		star: StarIcon,
		archive: ArchiveIcon,
		briefcase: BriefcaseIcon,
		compass: CompassIcon,
		cpu: CpuIcon,
		database: DatabaseIcon
	};

	let { name = 'Folder', size = 20, color = 'currentColor', weight = 'regular', class: className = '', children }: Props = $props();

	const IconComponent = $derived(ICON_MAP[name] ?? FolderIcon);
</script>

{#if children}
	{@render children()}
{:else}
	<IconComponent {size} {color} {weight} class={className} />
{/if}
