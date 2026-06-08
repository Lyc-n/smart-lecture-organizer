import { RangeSetBuilder } from '@codemirror/state';
import { Decoration, type DecorationSet, EditorView, ViewPlugin } from '@codemirror/view';

const hidden = Decoration.replace({});

const headingStyles = [
	'cm-md-h1',
	'cm-md-h2',
	'cm-md-h3',
	'cm-md-h4',
	'cm-md-h5',
	'cm-md-h6'
] as const;

type Dec = { from: number; to: number; decoration: Decoration };
type SyntaxRange = { from: number; to: number };

/** True when the cursor or any selection overlaps this markdown element. */
function isElementActive(view: EditorView, from: number, to: number) {
	for (const range of view.state.selection.ranges) {
		if (range.empty) {
			if (range.head >= from && range.head < to) return true;
		} else if (range.from < to && range.to > from) {
			return true;
		}
	}
	return false;
}

function applyPreview(
	decs: Dec[],
	view: EditorView,
	elementFrom: number,
	elementTo: number,
	syntaxRanges: SyntaxRange[],
	contentRanges: Array<{ from: number; to: number; class: string }>
) {
	if (isElementActive(view, elementFrom, elementTo)) return;

	for (const { from, to } of syntaxRanges) {
		if (from < to) decs.push({ from, to, decoration: hidden });
	}

	for (const { from, to, class: className } of contentRanges) {
		if (from < to) {
			decs.push({ from, to, decoration: Decoration.mark({ class: className }) });
		}
	}
}

function addInlineDecorations(decs: Dec[], view: EditorView, line: string, lineFrom: number) {
	const patterns: Array<{
		regexp: RegExp;
		apply: (match: RegExpExecArray) => void;
	}> = [
		{
			regexp: /\*\*(.+?)\*\*/g,
			apply: (match) => {
				const start = lineFrom + match.index!;
				const end = start + match[0].length;
				applyPreview(decs, view, start, end, [
					{ from: start, to: start + 2 },
					{ from: end - 2, to: end }
				], [{ from: start + 2, to: end - 2, class: 'cm-md-bold' }]);
			}
		},
		{
			regexp: /(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g,
			apply: (match) => {
				const start = lineFrom + match.index!;
				const end = start + match[0].length;
				applyPreview(decs, view, start, end, [
					{ from: start, to: start + 1 },
					{ from: end - 1, to: end }
				], [{ from: start + 1, to: end - 1, class: 'cm-md-italic' }]);
			}
		},
		{
			regexp: /~~(.+?)~~/g,
			apply: (match) => {
				const start = lineFrom + match.index!;
				const end = start + match[0].length;
				applyPreview(decs, view, start, end, [
					{ from: start, to: start + 2 },
					{ from: end - 2, to: end }
				], [{ from: start + 2, to: end - 2, class: 'cm-md-strike' }]);
			}
		},
		{
			regexp: /`([^`]+)`/g,
			apply: (match) => {
				const start = lineFrom + match.index!;
				const end = start + match[0].length;
				applyPreview(decs, view, start, end, [
					{ from: start, to: start + 1 },
					{ from: end - 1, to: end }
				], [{ from: start + 1, to: end - 1, class: 'cm-md-code' }]);
			}
		},
		{
			regexp: /\[([^\]]+)\]\(([^)]+)\)/g,
			apply: (match) => {
				const start = lineFrom + match.index!;
				const textStart = start + 1;
				const textEnd = textStart + match[1].length;
				const end = start + match[0].length;
				applyPreview(decs, view, start, end, [
					{ from: start, to: textStart },
					{ from: textEnd, to: end }
				], [{ from: textStart, to: textEnd, class: 'cm-md-link' }]);
			}
		}
	];

	for (const { regexp, apply } of patterns) {
		regexp.lastIndex = 0;
		let match: RegExpExecArray | null;
		while ((match = regexp.exec(line)) !== null) {
			apply(match);
		}
	}
}

function buildLivePreviewDecorations(view: EditorView): DecorationSet {
	const decs: Dec[] = [];
	const doc = view.state.doc.toString();

	let offset = 0;
	for (const line of doc.split('\n')) {
		const lineFrom = offset;
		const lineTo = offset + line.length;

		const headingMatch = line.match(/^(#{1,6})(\s)?(.*)$/);
		if (headingMatch?.[2] === ' ') {
			const level = headingMatch[1].length;
			const syntaxEnd = lineFrom + level + 1;
			applyPreview(
				decs,
				view,
				lineFrom,
				lineTo || syntaxEnd,
				[{ from: lineFrom, to: syntaxEnd }],
				headingMatch[3]
					? [{ from: syntaxEnd, to: lineTo, class: headingStyles[level - 1] }]
					: []
			);
		} else {
			const bulletMatch = line.match(/^(\s*[-*+]\s+)(.*)$/);
			if (bulletMatch) {
				const markerEnd = lineFrom + bulletMatch[1].length;
				applyPreview(
					decs,
					view,
					lineFrom,
					lineTo || markerEnd,
					[{ from: lineFrom, to: markerEnd }],
					bulletMatch[2] ? [{ from: markerEnd, to: lineTo, class: 'cm-md-list-item' }] : []
				);
			}

			const orderedMatch = line.match(/^(\s*\d+\.\s+)(.*)$/);
			if (orderedMatch) {
				const markerEnd = lineFrom + orderedMatch[1].length;
				applyPreview(
					decs,
					view,
					lineFrom,
					lineTo || markerEnd,
					[{ from: lineFrom, to: markerEnd }],
					orderedMatch[2] ? [{ from: markerEnd, to: lineTo, class: 'cm-md-list-item' }] : []
				);
			}

			const quoteMatch = line.match(/^>\s?(.*)$/);
			if (quoteMatch) {
				const markerEnd = lineFrom + (line.length - quoteMatch[1].length);
				if (!isElementActive(view, lineFrom, lineTo || markerEnd)) {
					decs.push({ from: lineFrom, to: markerEnd, decoration: hidden });
					decs.push({
						from: lineFrom,
						to: lineFrom,
						decoration: Decoration.line({ class: 'cm-md-blockquote' })
					});
				}
			}

			addInlineDecorations(decs, view, line, lineFrom);
		}

		offset += line.length + 1;
	}

	decs.sort((a, b) => a.from - b.from || a.to - b.to);

	const builder = new RangeSetBuilder<Decoration>();
	for (const { from, to, decoration } of decs) {
		builder.add(from, to, decoration);
	}

	return builder.finish();
}

export const livePreviewPlugin = ViewPlugin.fromClass(
	class {
		decorations: DecorationSet;

		constructor(view: EditorView) {
			this.decorations = buildLivePreviewDecorations(view);
		}

		update(update: {
			docChanged: boolean;
			selectionSet: boolean;
			viewportChanged: boolean;
			view: EditorView;
		}) {
			if (update.docChanged || update.selectionSet || update.viewportChanged) {
				this.decorations = buildLivePreviewDecorations(update.view);
			}
		}
	},
	{
		decorations: (plugin) => plugin.decorations,
		provide: (plugin) =>
			EditorView.atomicRanges.of((view) => {
				const set = view.plugin(plugin)?.decorations;
				if (!set) return Decoration.none;
				return set;
			})
	}
);

export const markdownEditorTheme = EditorView.theme({
	'&': {
		height: '100%',
		fontSize: '15px',
		lineHeight: '1.7'
	},
	'.cm-content': {
		fontFamily: 'inherit',
		padding: '1rem 1.5rem',
		caretColor: 'var(--color-primary, #6366f1)'
	},
	'.cm-scroller': {
		overflow: 'auto',
		fontFamily: 'inherit'
	},
	'.cm-line': {
		padding: '0'
	},
	'.cm-md-h1': { fontSize: '1.875rem', fontWeight: '700', lineHeight: '1.3' },
	'.cm-md-h2': { fontSize: '1.5rem', fontWeight: '700', lineHeight: '1.35' },
	'.cm-md-h3': { fontSize: '1.25rem', fontWeight: '600', lineHeight: '1.4' },
	'.cm-md-h4': { fontSize: '1.125rem', fontWeight: '600' },
	'.cm-md-h5': { fontSize: '1rem', fontWeight: '600' },
	'.cm-md-h6': { fontSize: '0.875rem', fontWeight: '600', color: '#64748b' },
	'.cm-md-bold': { fontWeight: '700' },
	'.cm-md-italic': { fontStyle: 'italic' },
	'.cm-md-strike': { textDecoration: 'line-through', opacity: '0.75' },
	'.cm-md-code': {
		fontFamily: 'ui-monospace, monospace',
		fontSize: '0.875em',
		backgroundColor: 'rgba(99, 102, 241, 0.08)',
		borderRadius: '0.25rem',
		padding: '0.1em 0.25em'
	},
	'.cm-md-link': { color: '#6366f1', textDecoration: 'underline' },
	'.cm-md-blockquote': {
		borderLeft: '3px solid rgba(99, 102, 241, 0.35)',
		paddingLeft: '0.75rem',
		color: '#64748b'
	},
	'.cm-md-list-item': {
		display: 'inline-block',
		paddingLeft: '0.25rem'
	}
});
