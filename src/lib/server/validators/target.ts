import { error } from '@sveltejs/kit';

export function parseTargetId(body: unknown): { itemId: string | null; groupId: string | null } {
	const data = body as Record<string, unknown>;
	const itemId = typeof data.item_id === 'string' ? data.item_id : null;
	const groupId = typeof data.group_id === 'string' ? data.group_id : null;
	return { itemId, groupId };
}

export function validateMutualExclusion(itemId: string | null, groupId: string | null): void {
	if (!itemId && !groupId) {
		error(400, 'Must provide item_id or group_id');
	}
	if (itemId && groupId) {
		error(400, 'Provide only one of item_id or group_id');
	}
}
