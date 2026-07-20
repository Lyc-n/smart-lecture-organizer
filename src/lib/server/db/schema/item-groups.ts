import { index, pgTable, primaryKey, uuid } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { items } from './items';
import { groups } from './groups';

export type ItemGroup = typeof itemGroups.$inferSelect;
export type NewItemGroup = typeof itemGroups.$inferInsert;

export const itemGroups = pgTable(
	'item_groups',
	{
		itemId: uuid('item_id')
			.notNull()
			.references(() => items.id, { onDelete: 'cascade' }),
		groupId: uuid('group_id')
			.notNull()
			.references(() => groups.id, { onDelete: 'cascade' })
	},
	(table) => [
		primaryKey({ columns: [table.itemId, table.groupId] }),
		index('idx_item_groups_group_id').on(table.groupId)
	]
);

export const itemGroupsRelations = relations(itemGroups, ({ one }) => ({
	item: one(items, {
		fields: [itemGroups.itemId],
		references: [items.id]
	}),
	group: one(groups, {
		fields: [itemGroups.groupId],
		references: [groups.id]
	})
}));
