import { auth } from '$lib/server/auth';
import { db } from '$lib/server/db';
import { groups } from '$lib/server/db/schema';
import { eq, asc } from 'drizzle-orm';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const session = await auth.api.getSession({
		headers: event.request.headers
	});

	if (!session) {
		redirect(302, '/auth/login');
	}

	const userGroups = await db
		.select({ id: groups.id, name: groups.name, color: groups.color, icon: groups.icon })
		.from(groups)
		.where(eq(groups.userId, session.user.id))
		.orderBy(asc(groups.sortOrder), asc(groups.name));

	return { groups: userGroups };
};
