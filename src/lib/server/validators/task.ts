import { error } from '@sveltejs/kit';

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

	return {
		title: data.title.trim(),
		description: typeof data.description === 'string' ? data.description.trim() || null : null,
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
		updates.title = data.title.trim();
	}

	if (data.description !== undefined) {
		updates.description = typeof data.description === 'string' ? data.description.trim() || null : null;
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
