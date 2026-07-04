import { boolean, pgTable, text, timestamp, bigint } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
	id: text('id').primaryKey(),
	email: text('email').notNull().unique(),
	emailVerified: boolean('email_verified').default(false),
	name: text('name'),
	image: text('image'),
	storageUsed: bigint('storage_used', { mode: 'number' }).notNull().default(0),
	storageLimit: bigint('storage_limit', { mode: 'number' }).notNull().default(52428800),
	createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
	updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow()
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
