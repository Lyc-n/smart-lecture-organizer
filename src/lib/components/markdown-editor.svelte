<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { defaultKeymap, history, historyKeymap } from '@codemirror/commands';
	import { markdownLanguage } from '@codemirror/lang-markdown';
	import { LanguageSupport } from '@codemirror/language';
	import { EditorState, type Extension } from '@codemirror/state';
	import {
		drawSelection,
		dropCursor,
		EditorView,
		highlightActiveLine,
		highlightSpecialChars,
		keymap,
		placeholder as cmPlaceholder
	} from '@codemirror/view';
	import { livePreviewPlugin, markdownEditorTheme } from '$lib/codemirror/live-preview';
	import { cn } from '$lib/utils.js';

	let {
		value = $bindable(''),
		placeholder = 'Start writing...',
		class: className
	}: {
		value?: string;
		placeholder?: string;
		class?: string;
	} = $props();

	let container: HTMLDivElement | undefined = $state();
	let view: EditorView | null = null;
	let syncing = false;

	function createEditor() {
		if (!container) return;

		const extensions: Extension[] = [
			highlightSpecialChars(),
			history(),
			drawSelection(),
			dropCursor(),
			highlightActiveLine(),
			EditorState.allowMultipleSelections.of(true),
			keymap.of([...defaultKeymap, ...historyKeymap]),
			new LanguageSupport(markdownLanguage),
			livePreviewPlugin,
			markdownEditorTheme,
			cmPlaceholder(placeholder),
			EditorView.lineWrapping,
			EditorView.updateListener.of((update) => {
				if (update.docChanged && !syncing) {
					value = update.state.doc.toString();
				}
			})
		];

		view = new EditorView({
			state: EditorState.create({
				doc: value,
				extensions
			}),
			parent: container
		});
	}

	$effect(() => {
		if (!view) return;

		const current = view.state.doc.toString();
		if (value !== current) {
			syncing = true;
			view.dispatch({
				changes: { from: 0, to: current.length, insert: value }
			});
			syncing = false;
		}
	});

	onMount(createEditor);

	onDestroy(() => {
		view?.destroy();
		view = null;
	});
</script>

<div
	bind:this={container}
	class={cn(
		'min-h-0 flex-1 overflow-hidden rounded-3xl border border-transparent bg-white shadow-[0_0_1px_1px_rgba(0,0,0,0.08)]',
		className
	)}
></div>

<style>
	:global(.cm-editor) {
		height: 100%;
		background: transparent;
	}

	:global(.cm-editor.cm-focused) {
		outline: none;
	}

	:global(.cm-gutters) {
		display: none;
	}
</style>
