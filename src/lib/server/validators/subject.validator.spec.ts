import { describe, it, expect } from 'vitest';
import { CreateSubjectSchema, UpdateSubjectSchema } from './subject.validator';

describe('CreateSubjectSchema', () => {
	it('accepts valid input', () => {
		const result = CreateSubjectSchema.parse({ name: 'Mathematics' });
		expect(result).toEqual({ name: 'Mathematics' });
	});

	it('accepts input with description', () => {
		const result = CreateSubjectSchema.parse({ name: 'Physics', description: 'Mechanics' });
		expect(result.description).toBe('Mechanics');
	});

	it('rejects name shorter than 3 chars', () => {
		expect(() => CreateSubjectSchema.parse({ name: 'AB' })).toThrow();
	});

	it('rejects name longer than 255 chars', () => {
		expect(() => CreateSubjectSchema.parse({ name: 'A'.repeat(256) })).toThrow();
	});

	it('rejects missing name', () => {
		expect(() => CreateSubjectSchema.parse({})).toThrow();
	});
});

describe('UpdateSubjectSchema', () => {
	it('accepts partial update', () => {
		const result = UpdateSubjectSchema.parse({ name: 'Updated' });
		expect(result.name).toBe('Updated');
	});

	it('accepts empty object', () => {
		const result = UpdateSubjectSchema.parse({});
		expect(result).toEqual({});
	});
});
