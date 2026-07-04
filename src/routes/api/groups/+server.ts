import { auth } from '$lib/server/auth';
import { db } from '$lib/server/db';
import { groups } from '$lib/server/db/schema';
import { json, error } from '@sveltejs/kit';
import { eq, asc } from 'drizzle-orm';
import type { RequestHandler } from './$types';

const HEX_COLOR = /^#[0-9a-fA-F]{6}$/;

const VALID_ICONS = [
	'folder', 'book', 'graduation-cap', 'calculator', 'flask',
	'globe', 'music', 'image', 'file-text', 'video',
	'code', 'pen-tool', 'bar-chart', 'heart', 'star',
	'archive', 'briefcase', 'compass', 'cpu', 'database'
];

function parseBody(body: unknown): {
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
	if (!VALID_ICONS.includes(icon)) {
		error(400, `Invalid icon. Valid icons: ${VALID_ICONS.join(', ')}`);
	}

	const subtitle = typeof data.subtitle === 'string' ? data.subtitle.trim() || undefined : undefined;
	const description = typeof data.description === 'string' ? data.description.trim() || undefined : undefined;
	const parentId = typeof data.parent_id === 'string' ? data.parent_id : undefined;

	return { name: data.name.trim(), color, icon, subtitle, description, parentId };
}

export const GET: RequestHandler = async (event) => {
	const session = await auth.api.getSession({
		headers: event.request.headers
	});

	if (!session) {
		error(401, 'Unauthorized');
	}

	const userGroups = await db
		.select()
		.from(groups)
		.where(eq(groups.userId, session.user.id))
		.orderBy(asc(groups.sortOrder), asc(groups.name));

	return json(userGroups);
};

export const POST: RequestHandler = async (event) => {
	const session = await auth.api.getSession({
		headers: event.request.headers
	});

	if (!session) {
		error(401, 'Unauthorized');
	}

	const body = await event.request.json();
	const { name, color, icon, subtitle, description, parentId } = parseBody(body);

	if (parentId) {
		const parent = await db
			.select({ id: groups.id, userId: groups.userId })
			.from(groups)
			.where(eq(groups.id, parentId))
			.then((r) => r[0]);

		if (!parent) {
			error(404, 'Parent group not found');
		}
		if (parent.userId !== session.user.id) {
			error(403, 'Parent group does not belong to you');
		}
	}

	const [created] = await db
		.insert(groups)
		.values({
			userId: session.user.id,
			name,
			color,
			icon,
			subtitle,
			description,
			parentId
		})
		.returning();

	return json(created, { status: 201 });
};
