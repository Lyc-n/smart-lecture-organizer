import { describe, it, expect, vi } from 'vitest';

const mockSelect = vi.fn();
const mockInsert = vi.fn();
const mockUpdate = vi.fn();
const mockDelete = vi.fn();

vi.mock('../db', () => ({
	db: {
		select: () => ({
			from: () => ({
				where: () => ({
					limit: (limit: number) => mockSelect(limit)
				})
			})
		}),
		insert: () => ({
			values: () => ({
				returning: () => mockInsert()
			})
		}),
		update: () => ({
			set: () => ({
				where: () => ({
					returning: () => mockUpdate()
				})
			})
		}),
		delete: () => ({
			where: () => ({
				returning: () => mockDelete()
			})
		})
	}
}));

import { createRepository } from './base';

describe('createRepository', () => {
	const table = { id: 'id' } as never;
	const repo = createRepository<{ id: string; name: string }, { name: string }>(table);

	vi.clearAllMocks();

	it('findById returns row or null', async () => {
		mockSelect.mockResolvedValueOnce([{ id: '1', name: 'test' }]);
		const result = await repo.findById('1');
		expect(result).toEqual({ id: '1', name: 'test' });
	});

	it('findById returns null when not found', async () => {
		mockSelect.mockResolvedValueOnce([]);
		const result = await repo.findById('1');
		expect(result).toBeNull();
	});

	it('create returns the created row', async () => {
		mockInsert.mockResolvedValueOnce([{ id: '1', name: 'test' }]);
		const result = await repo.create({ name: 'test' });
		expect(result).toEqual({ id: '1', name: 'test' });
	});

	it('update returns the updated row', async () => {
		mockUpdate.mockResolvedValueOnce([{ id: '1', name: 'updated' }]);
		const result = await repo.update('1', { name: 'updated' });
		expect(result).toEqual({ id: '1', name: 'updated' });
	});

	it('delete returns the deleted row', async () => {
		mockDelete.mockResolvedValueOnce([{ id: '1' }]);
		const result = await repo.delete('1');
		expect(result).toEqual({ id: '1' });
	});
});
