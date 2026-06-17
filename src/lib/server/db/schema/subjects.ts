import { pgTable, uuid, varchar, text, timestamp } from 'drizzle-orm/pg-core';
import { user } from '../../../../../auth-schema';

export const subjects = pgTable('subjects', {
	id: uuid('id').primaryKey().defaultRandom(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' }),
	name: varchar('name', { length: 255 }).notNull(),
	description: text('description'),
	createdAt: timestamp('created_at').notNull().defaultNow(),
	updateAt: timestamp('updated_at').notNull().defaultNow()
});
