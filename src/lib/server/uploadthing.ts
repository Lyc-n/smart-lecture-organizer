import { eq } from 'drizzle-orm';
import { createUploadthing, UploadThingError, type FileRouter } from 'uploadthing/server';
import imghash from 'imghash';
import { auth } from '$lib/server/auth';
import { db } from '$lib/server/db';
import { items } from '$lib/server/db/schema';
import { enforceQuota } from '$lib/server/services/storage';

const f = createUploadthing();

function getItemType(mimeType: string): 'document' | 'audio' | 'video' | 'image' | 'note' {
	if (mimeType.startsWith('image/')) return 'image';
	if (mimeType.startsWith('video/')) return 'video';
	if (mimeType.startsWith('audio/')) return 'audio';
	return 'document';
}

export const fileRouter = {
	fileUploader: f({
		image: { maxFileSize: '8MB', maxFileCount: 10 },
		video: { maxFileSize: '8MB', maxFileCount: 5 },
		audio: { maxFileSize: '8MB', maxFileCount: 5 },
		pdf: { maxFileSize: '8MB', maxFileCount: 5 },
		text: { maxFileSize: '8MB', maxFileCount: 5 },
		blob: { maxFileSize: '8MB', maxFileCount: 10 }
	})
		.middleware(async ({ req, files }) => {
			const session = await auth.api.getSession({
				headers: req.headers
			});

			if (!session) {
				throw new UploadThingError('Unauthorized');
			}

			const totalSize = files.reduce((sum, f) => sum + f.size, 0);
			await enforceQuota(session.user.id, totalSize);

			return { userId: session.user.id };
		})
		.onUploadComplete(async ({ metadata, file }) => {
			const itemType = getItemType(file.type);

			const [item] = await db
				.insert(items)
				.values({
					userId: metadata.userId,
					name: file.name,
					type: itemType,
					mimeType: file.type,
					fileSize: file.size,
					fileKey: file.key,
					fileUrl: file.ufsUrl ?? file.url
				})
				.returning();

			if (itemType === 'image') {
				setTimeout(async () => {
					try {
						const response = await fetch(file.ufsUrl ?? file.url);
						const buffer = Buffer.from(await response.arrayBuffer());
						const hexHash = await imghash.hash(buffer);
						await db.update(items).set({ fileHash: hexHash }).where(eq(items.id, item.id));
					} catch (e) {
						console.error('Failed to compute image hash:', e);
					}
				}, 0);
			}

			return { itemId: item.id };
		})
} satisfies FileRouter;

export type OurFileRouter = typeof fileRouter;
