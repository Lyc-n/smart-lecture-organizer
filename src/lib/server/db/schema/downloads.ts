import { pgTable, uuid, text, timestamp } from 'drizzle-orm/pg-core';
import { user } from '../../../../../auth-schema';
import { materials } from './materials';

export const downloads = pgTable('downloads', {
	id: uuid('id').primaryKey().defaultRandom(),
	materialId: uuid('material_id')
		.notNull()
		.references(() => materials.id, { onDelete: 'cascade' }),
	userId: text('user_id')
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' }),
	downloadedAt: timestamp('downloaded_at').notNull().defaultNow()
});
