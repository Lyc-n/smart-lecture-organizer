import { describe, it, expect } from 'vitest';
import {
	CreateNoteSchema,
	CreateDraftNoteSchema,
	CreateMaterialNoteSchema,
	UpdateNoteSchema
} from './note.validator';

describe('CreateNoteSchema', () => {
	it('accepts valid input', () => {
		const result = CreateNoteSchema.parse({
			title: 'My Note',
			content: 'Some content',
			subjectId: '550e8400-e29b-41d4-a716-446655440000'
		});
		expect(result.title).toBe('My Note');
	});

	it('rejects empty title', () => {
		expect(() =>
			CreateNoteSchema.parse({
				title: '',
				content: 'body',
				subjectId: '550e8400-e29b-41d4-a716-446655440000'
			})
		).toThrow();
	});

	it('rejects content over 10000 chars', () => {
		expect(() =>
			CreateNoteSchema.parse({
				title: 'Note',
				content: 'x'.repeat(10001),
				subjectId: '550e8400-e29b-41d4-a716-446655440000'
			})
		).toThrow();
	});

	it('rejects invalid subjectId', () => {
		expect(() =>
			CreateNoteSchema.parse({ title: 'Note', content: 'body', subjectId: 'not-a-uuid' })
		).toThrow();
	});
});

describe('CreateDraftNoteSchema', () => {
	it('accepts empty input', () => {
		const result = CreateDraftNoteSchema.parse({});
		expect(result).toEqual({});
	});

	it('accepts with subjectId', () => {
		const result = CreateDraftNoteSchema.parse({
			subjectId: '550e8400-e29b-41d4-a716-446655440000'
		});
		expect(result.subjectId).toBeDefined();
	});
});

describe('CreateMaterialNoteSchema', () => {
	it('accepts content only', () => {
		const result = CreateMaterialNoteSchema.parse({ content: 'Note body' });
		expect(result.content).toBe('Note body');
	});

	it('accepts optional title', () => {
		const result = CreateMaterialNoteSchema.parse({ content: 'body', title: 'Title' });
		expect(result.title).toBe('Title');
	});
});

describe('UpdateNoteSchema', () => {
	it('accepts partial update', () => {
		const result = UpdateNoteSchema.parse({ title: 'Renamed' });
		expect(result.title).toBe('Renamed');
	});

	it('rejects content over 10000 chars', () => {
		expect(() => UpdateNoteSchema.parse({ content: 'x'.repeat(10001) })).toThrow();
	});
});
