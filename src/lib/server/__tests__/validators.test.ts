import { describe, it, expect } from 'vitest';
import { validateUUID, validateStringLength, validateArrayLength } from '../validators/common';

describe('validateUUID', () => {
	it('accepts valid UUIDs', () => {
		expect(validateUUID('550e8400-e29b-41d4-a716-446655440000')).toBe('550e8400-e29b-41d4-a716-446655440000');
		expect(validateUUID('550E8400-E29B-41D4-A716-446655440000')).toBe('550E8400-E29B-41D4-A716-446655440000');
	});

	it('rejects invalid UUIDs', () => {
		expect(() => validateUUID('not-a-uuid')).toThrow();
		expect(() => validateUUID('')).toThrow();
		expect(() => validateUUID(123)).toThrow();
		expect(() => validateUUID('550e8400-e29b-41d4-a716')).toThrow();
	});
});

describe('validateStringLength', () => {
	it('accepts strings within limits', () => {
		expect(validateStringLength('hello', 'test')).toBe('hello');
		expect(validateStringLength('a'.repeat(100), 'test', { max: 100 })).toBe('a'.repeat(100));
	});

	it('rejects empty strings when min=1', () => {
		expect(() => validateStringLength('', 'test')).toThrow();
	});

	it('rejects strings exceeding max', () => {
		expect(() => validateStringLength('a'.repeat(101), 'test', { max: 100 })).toThrow();
	});
});

describe('validateArrayLength', () => {
	it('accepts arrays within limits', () => {
		expect(validateArrayLength([1, 2, 3], 'test', { max: 5 })).toEqual([1, 2, 3]);
		expect(validateArrayLength([], 'test')).toEqual([]);
	});

	it('rejects arrays exceeding max', () => {
		expect(() => validateArrayLength([1, 2, 3], 'test', { max: 2 })).toThrow();
	});
});
