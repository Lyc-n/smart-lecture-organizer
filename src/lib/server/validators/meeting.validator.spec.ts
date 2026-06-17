import { describe, it, expect } from 'vitest';
import { CreateMeetingSchema, UpdateMeetingSchema } from './meeting.validator';

describe('CreateMeetingSchema', () => {
	it('accepts valid input', () => {
		const result = CreateMeetingSchema.parse({
			weekNumber: 3,
			title: 'Kinematics'
		});
		expect(result.title).toBe('Kinematics');
		expect(result.weekNumber).toBe(3);
	});

	it('accepts input with optional fields', () => {
		const result = CreateMeetingSchema.parse({
			weekNumber: 1,
			title: 'Intro',
			subjectId: '550e8400-e29b-41d4-a716-446655440000',
			description: 'First meeting'
		});
		expect(result.subjectId).toBe('550e8400-e29b-41d4-a716-446655440000');
		expect(result.description).toBe('First meeting');
	});

	it('rejects weekNumber below 1', () => {
		expect(() => CreateMeetingSchema.parse({ weekNumber: 0, title: 'Test' })).toThrow();
	});

	it('rejects weekNumber above 16', () => {
		expect(() => CreateMeetingSchema.parse({ weekNumber: 17, title: 'Test' })).toThrow();
	});

	it('rejects non-integer weekNumber', () => {
		expect(() => CreateMeetingSchema.parse({ weekNumber: 1.5, title: 'Test' })).toThrow();
	});

	it('rejects short title', () => {
		expect(() => CreateMeetingSchema.parse({ weekNumber: 1, title: 'AB' })).toThrow();
	});
});

describe('UpdateMeetingSchema', () => {
	it('accepts partial update', () => {
		const result = UpdateMeetingSchema.parse({ title: 'Updated' });
		expect(result.title).toBe('Updated');
	});
});
