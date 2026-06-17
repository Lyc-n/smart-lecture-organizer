// import DOMPurify from 'isomorphic-dompurify';
// import { marked } from 'marked';

// marked.setOptions({
// 	gfm: true,
// 	breaks: true
// });

export function renderMarkdown(content: string): string {
	if (!content.trim()) return '';
	// return DOMPurify.sanitize(marked.parse(content, { async: false }) as string);
	return content;
}
