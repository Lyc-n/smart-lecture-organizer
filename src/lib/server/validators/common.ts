import { error } from '@sveltejs/kit';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function validateUUID(value: unknown, field = 'id'): string {
	if (typeof value !== 'string' || !UUID_REGEX.test(value)) {
		error(400, `Invalid ${field} format`);
	}
	return value;
}

export function validateStringLength(
	value: string,
	field: string,
	opts: { min?: number; max?: number } = {}
): string {
	const { min = 1, max = 1000 } = opts;

	if (value.length < min) {
		error(400, `${field} must be at least ${min} characters`);
	}
	if (value.length > max) {
		error(400, `${field} must be at most ${max} characters`);
	}
	return value;
}

export function validateArrayLength<T>(
	value: T[],
	field: string,
	opts: { min?: number; max?: number } = {}
): T[] {
	const { min = 0, max = 100 } = opts;

	if (value.length < min) {
		error(400, `${field} must have at least ${min} items`);
	}
	if (value.length > max) {
		error(400, `${field} must have at most ${max} items`);
	}
	return value;
}
