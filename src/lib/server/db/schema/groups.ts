import { index, integer, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { users } from './users';
import { itemGroups } from './item-groups';
import { tasks } from './tasks';
import { bookmarks } from './bookmarks';
import { recentAccess } from './recent-access';

export type Group = typeof groups.$inferSelect;
export type NewGroup = typeof groups.$inferInsert;

export const groups = pgTable(
	'groups',
	{
		id: uuid('id').defaultRandom().primaryKey(),
		userId: text('user_id')
			.notNull()
			.references(() => users.id, { onDelete: 'cascade' }),
		parentId: uuid('parent_id').references((): any => groups.id, { onDelete: 'cascade' }),
		name: text('name').notNull(),
		subtitle: text('subtitle'),
		description: text('description'),
		color: text('color').notNull().default('#6366f1'),
		icon: text('icon').notNull().default('folder'),
		sortOrder: integer('sort_order').notNull().default(0),
		createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
		updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow()
	},
	(table) => [
		index('idx_groups_user_id').on(table.userId),
		index('idx_groups_parent_id').on(table.parentId),
		index('idx_groups_user_sort').on(table.userId, table.sortOrder, table.name)
	]
);

export const groupsRelations = relations(groups, ({ one, many }) => ({
	parent: one(groups, {
		fields: [groups.parentId],
		references: [groups.id],
		relationName: 'parent_group'
	}),
	children: many(groups, { relationName: 'parent_group' }),
	user: one(users, {
		fields: [groups.userId],
		references: [users.id]
	}),
	items: many(itemGroups),
	tasks: many(tasks),
	bookmarks: many(bookmarks),
	recentAccess: many(recentAccess)
}));
