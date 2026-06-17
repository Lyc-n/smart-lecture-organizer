import { db } from '../db';
import { eq } from 'drizzle-orm';
import type { AnyPgTable, AnyPgColumn } from 'drizzle-orm/pg-core';

/**
 * Tipe return dari `createRepository`.
 * @template T - Tipe row (select).
 * @template TInsert - Tipe data untuk insert (default = T).
 */
type Repo<T, TInsert> = {
	findById: (id: string) => Promise<T | null>;
	findAll: () => Promise<T[]>;
	create: (data: TInsert) => Promise<T>;
	update: (id: string, data: Partial<TInsert>) => Promise<T>;
	delete: (id: string) => Promise<T>;
};

/**
 * Factory untuk membuat CRUD repository standar.
 * Menerima tabel Drizzle, mengembalikan 5 method dasar.
 *
 * @example
 * const base = createRepository<typeof users.$inferSelect>(users);
 * await base.findById('uuid');
 * await base.create({ name: 'foo' });
 *
 * @template T - Tipe row hasil query.
 * @template TInsert - Tipe data untuk insert.
 * @param table - Instance tabel Drizzle.
 */
export function createRepository<T, TInsert = T>(table: AnyPgTable): Repo<T, TInsert> {
	const idColumn = (table as AnyPgTable & { id: AnyPgColumn }).id;

	return {
		/** Cari satu row berdasarkan UUID. */
		async findById(id) {
			const rows = await db.select().from(table).where(eq(idColumn, id)).limit(1);
			return (rows as unknown as T[])[0] ?? null;
		},

		/** Ambil semua row. */
		async findAll() {
			const rows = await db.select().from(table);
			return rows as unknown as T[];
		},

		/** Buat row baru. */
		async create(data) {
			const rows = await db.insert(table).values(data as Record<string, unknown>).returning();
			return (rows as unknown as T[])[0];
		},

		/** Update row berdasarkan UUID. */
		async update(id, data) {
			const rows = await db.update(table).set(data as Record<string, unknown>).where(eq(idColumn, id)).returning();
			return (rows as unknown as T[])[0];
		},

		/** Hapus row berdasarkan UUID. */
		async delete(id) {
			const rows = await db.delete(table).where(eq(idColumn, id)).returning();
			return (rows as unknown as T[])[0];
		}
	};
}
