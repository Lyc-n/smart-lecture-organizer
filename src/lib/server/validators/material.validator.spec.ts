import { describe, it, expect } from 'vitest';
import { CreateMaterialSchema, UpdateMaterialSchema } from './material.validator';

describe('CreateMaterialSchema', () => {
	const validInput = {
		title: 'Lecture Notes',
		fileName: 'notes.pdf',
		mimeType: 'application/pdf',
		fileSize: 1024,
		fileKey: 'key-123',
		fileUrl: 'https://example.com/file'
	};

	it('accepts valid input', () => {
		const result = CreateMaterialSchema.parse(validInput);
		expect(result.title).toBe('Lecture Notes');
	});

	it('accepts optional fields', () => {
		const result = CreateMaterialSchema.parse({
			...validInput,
			description: 'Chapter 1',
			subjectId: '550e8400-e29b-41d4-a716-446655440000',
			status: 'pending',
			category: 'slides',
			meetingId: null
		});
		expect(result.description).toBe('Chapter 1');
		expect(result.status).toBe('pending');
	});

	it('rejects short title', () => {
		expect(() =>
			CreateMaterialSchema.parse({ ...validInput, title: 'AB' })
		).toThrow();
	});

	it('rejects non-positive fileSize', () => {
		expect(() =>
			CreateMaterialSchema.parse({ ...validInput, fileSize: 0 })
		).toThrow();
	});

	it('rejects invalid status', () => {
		expect(() =>
			CreateMaterialSchema.parse({ ...validInput, status: 'invalid' })
		).toThrow();
	});
});

describe('UpdateMaterialSchema', () => {
	it('accepts partial update', () => {
		const result = UpdateMaterialSchema.parse({ title: 'Updated' });
		expect(result.title).toBe('Updated');
	});
});
