import { error } from '@sveltejs/kit';
import { HEX_COLOR, VALID_ICONS } from '$lib/server/constants';
import { validateStringLength } from '$lib/server/validators/common';

export function parseBody(body: unknown): {
	name: string;
	color: string;
	icon: string;
	subtitle: string | undefined;
	description: string | undefined;
	parentId: string | undefined;
} {
	if (!body || typeof body !== 'object') {
		error(400, 'Invalid request body');
	}

	const data = body as Record<string, unknown>;

	if (!data.name || typeof data.name !== 'string' || data.name.trim().length === 0) {
		error(400, 'Name is required');
	}

	const color = typeof data.color === 'string' ? data.color : '#6366f1';
	if (color !== '#6366f1' && !HEX_COLOR.test(color)) {
		error(400, 'Invalid color format (expected hex, e.g. #6366f1)');
	}

	const icon = typeof data.icon === 'string' ? data.icon : 'folder';
	if (!VALID_ICONS.includes(icon as (typeof VALID_ICONS)[number])) {
		error(400, `Invalid icon. Valid icons: ${VALID_ICONS.join(', ')}`);
	}

	const subtitle = typeof data.subtitle === 'string' ? data.subtitle.trim() || undefined : undefined;
	const description = typeof data.description === 'string' ? data.description.trim() || undefined : undefined;
	const parentId = typeof data.parent_id === 'string' ? data.parent_id : undefined;

	const name = validateStringLength(data.name.trim(), 'Name', { max: 100 });
	if (subtitle) validateStringLength(subtitle, 'Subtitle', { max: 200 });
	if (description) validateStringLength(description, 'Description', { max: 5000 });

	return { name, color, icon, subtitle, description, parentId };
}

export function validatePatchBody(body: unknown): Record<string, unknown> {
	if (!body || typeof body !== 'object') {
		error(400, 'Invalid request body');
	}

	const data = body as Record<string, unknown>;
	const updates: Record<string, unknown> = {};

	if (data.name !== undefined) {
		if (typeof data.name !== 'string' || data.name.trim().length === 0) {
			error(400, 'Name cannot be empty');
		}
		updates.name = validateStringLength(data.name.trim(), 'Name', { max: 100 });
	}

	if (data.color !== undefined) {
		if (typeof data.color !== 'string' || (data.color !== '#6366f1' && !HEX_COLOR.test(data.color))) {
			error(400, 'Invalid color format (expected hex, e.g. #6366f1)');
		}
		updates.color = data.color;
	}

	if (data.icon !== undefined) {
		if (typeof data.icon !== 'string' || !VALID_ICONS.includes(data.icon as (typeof VALID_ICONS)[number])) {
			error(400, `Invalid icon. Valid icons: ${VALID_ICONS.join(', ')}`);
		}
		updates.icon = data.icon;
	}

	if (data.subtitle !== undefined) {
		const val = typeof data.subtitle === 'string' ? data.subtitle.trim() || null : null;
		updates.subtitle = val ? validateStringLength(val, 'Subtitle', { max: 200 }) : null;
	}

	if (data.description !== undefined) {
		const val = typeof data.description === 'string' ? data.description.trim() || null : null;
		updates.description = val ? validateStringLength(val, 'Description', { max: 5000 }) : null;
	}

	if (data.parent_id !== undefined) {
		updates.parentId = data.parent_id === null ? null : data.parent_id;
	}

	return updates;
}
