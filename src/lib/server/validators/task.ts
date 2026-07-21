import { error } from '@sveltejs/kit';
import { validateStringLength } from '$lib/server/validators/common';

export function parseCreateTask(body: unknown): {
	title: string;
	description: string | null;
	groupId: string | null;
	itemId: string | null;
	deadline: Date | null;
} {
	if (!body || typeof body !== 'object') {
		error(400, 'Invalid request body');
	}

	const data = body as Record<string, unknown>;

	if (!data.title || typeof data.title !== 'string' || data.title.trim().length === 0) {
		error(400, 'Title is required');
	}

	const title = validateStringLength(data.title.trim(), 'Title', { max: 200 });
	const description = typeof data.description === 'string' ? data.description.trim() || null : null;
	if (description) validateStringLength(description, 'Description', { max: 5000 });

	return {
		title,
		description,
		groupId: typeof data.group_id === 'string' ? data.group_id : null,
		itemId: typeof data.item_id === 'string' ? data.item_id : null,
		deadline: typeof data.deadline === 'string' ? new Date(data.deadline) : null
	};
}

export function parseUpdateTask(body: unknown): Record<string, unknown> {
	if (!body || typeof body !== 'object') {
		error(400, 'Invalid request body');
	}

	const data = body as Record<string, unknown>;
	const updates: Record<string, unknown> = {};

	if (data.title !== undefined) {
		if (typeof data.title !== 'string' || data.title.trim().length === 0) {
			error(400, 'Title cannot be empty');
		}
		updates.title = validateStringLength(data.title.trim(), 'Title', { max: 200 });
	}

	if (data.description !== undefined) {
		const val = typeof data.description === 'string' ? data.description.trim() || null : null;
		updates.description = val ? validateStringLength(val, 'Description', { max: 5000 }) : null;
	}

	if (data.deadline !== undefined) {
		updates.deadline = data.deadline === null ? null : new Date(data.deadline as string);
	}

	if (data.is_completed !== undefined) {
		updates.isCompleted = Boolean(data.is_completed);
	}

	if (Object.keys(updates).length === 0) {
		error(400, 'No valid fields to update');
	}

	return updates;
}
