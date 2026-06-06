import { BookmarkRepository } from '$lib/server/repositories/bookmark.repository';

export const BookmarkService = {
	create(userId: string, materialId: string) {
		return BookmarkRepository.create(userId, materialId);
	},

	remove(userId: string, materialId: string) {
		return BookmarkRepository.remove(userId, materialId);
	},

	getUserBookmarks(userId: string) {
		return BookmarkRepository.findByUserId(userId);
	}
};
