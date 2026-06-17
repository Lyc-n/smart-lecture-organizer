import { describe, it, expect } from 'vitest';
import { getFileTypeLabel } from './file-type-label';

describe('getFileTypeLabel', () => {
	it('returns extension from filename', () => {
		expect(getFileTypeLabel('document.pdf', 'application/pdf')).toBe('PDF');
		expect(getFileTypeLabel('image.PNG', 'image/png')).toBe('PNG');
		expect(getFileTypeLabel('script.js', 'text/javascript')).toBe('JS');
	});

	it('returns whole name as label when no dot and length <= 6', () => {
		expect(getFileTypeLabel('noext', 'application/zip')).toBe('NOEXT');
	});

	it('falls back to mimeType map when extension > 6 chars', () => {
		expect(getFileTypeLabel('archive.tarball', 'application/pdf')).toBe('PDF');
	});

	it('returns FILE for unknown mimeType and no recognizable extension', () => {
		expect(getFileTypeLabel('archive.tarball', 'application/zip')).toBe('FILE');
	});
});
