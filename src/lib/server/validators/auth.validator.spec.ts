import { describe, it, expect } from 'vitest';
import { RegisterSchema, LoginSchema } from './auth.validator';

describe('RegisterSchema', () => {
	it('accepts valid input', () => {
		const result = RegisterSchema.parse({
			name: 'John Doe',
			email: 'john@example.com',
			password: 'secret123'
		});
		expect(result.name).toBe('John Doe');
		expect(result.email).toBe('john@example.com');
	});

	it('rejects short name', () => {
		expect(() =>
			RegisterSchema.parse({ name: 'AB', email: 'a@b.com', password: 'secret123' })
		).toThrow();
	});

	it('rejects invalid email', () => {
		expect(() =>
			RegisterSchema.parse({ name: 'John', email: 'not-an-email', password: 'secret123' })
		).toThrow();
	});

	it('rejects short password', () => {
		expect(() =>
			RegisterSchema.parse({ name: 'John', email: 'john@example.com', password: '123' })
		).toThrow();
	});
});

describe('LoginSchema', () => {
	it('accepts valid input', () => {
		const result = LoginSchema.parse({
			email: 'john@example.com',
			password: 'secret123'
		});
		expect(result.email).toBe('john@example.com');
	});

	it('rejects invalid email', () => {
		expect(() =>
			LoginSchema.parse({ email: 'bad', password: 'secret123' })
		).toThrow();
	});
});
