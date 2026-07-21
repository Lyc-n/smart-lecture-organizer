import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import { DATABASE_URL } from '$env/static/private';

import * as schema from './schema';

const client = new pg.Pool({
	connectionString: DATABASE_URL,
	max: 5,
	idleTimeoutMillis: 30_000,
	connectionTimeoutMillis: 10_000,
	allowExitOnIdle: true
});

export const db = drizzle({ client, schema });
