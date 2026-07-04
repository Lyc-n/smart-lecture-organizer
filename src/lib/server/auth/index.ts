import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { sveltekitCookies } from 'better-auth/svelte-kit';
import { getRequestEvent } from '@sveltejs/kit/internal/server';
import { BETTER_AUTH_URL, BETTER_AUTH_SECRET } from '$env/static/private';
import { db } from '$lib/server/db';

export const auth = betterAuth({
	baseURL: BETTER_AUTH_URL,
	secret: BETTER_AUTH_SECRET,
	database: drizzleAdapter(db, {
		provider: 'pg',
		usePlural: true
	}),
	plugins: [
		sveltekitCookies(getRequestEvent)
	],
	emailAndPassword: {
		enabled: true
	},
	rateLimit: {
		enabled: true,
		window: 60,
		max: 10,
		customRules: {
			'/sign-in': { window: 60, max: 5 },
			'/sign-up': { window: 3600, max: 3 }
		}
	}
});
