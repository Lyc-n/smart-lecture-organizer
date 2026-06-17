import { pgTable, uuid, text, timestamp, unique } from 'drizzle-orm/pg-core';
import { user } from '../../../../../auth-schema';
import { materials } from './materials';

export const bookmarks = pgTable(
	'bookmarks',
	{
		id: uuid('id').primaryKey().defaultRandom(),
		materialId: uuid('material_id')
			.notNull()
			.references(() => materials.id, { onDelete: 'cascade' }),
		userId: text('user_id')
			.notNull()
			.references(() => user.id, { onDelete: 'cascade' }),
		createdAt: timestamp('created_at').notNull().defaultNow()
	},
	(table) => [unique('uniqueBookmark').on(table.materialId, table.userId)]
);
