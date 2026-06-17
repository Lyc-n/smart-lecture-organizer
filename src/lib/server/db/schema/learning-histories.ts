import { pgTable, uuid, text, timestamp } from 'drizzle-orm/pg-core';
import { user } from '../../../../../auth-schema';
import { materials } from './materials';

export const learningHistories = pgTable('learning_histories', {
	id: uuid('id').primaryKey().defaultRandom(),
	materialId: uuid('material_id')
		.notNull()
		.references(() => materials.id, { onDelete: 'cascade' }),
	userId: text('user_id')
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' }),
	viewedAt: timestamp('viewed_at').notNull().defaultNow()
});
