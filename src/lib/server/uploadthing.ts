import { createUploadthing, type FileRouter } from 'uploadthing/server';
import { auth } from './auth';
import { db } from './db';
import { materials } from './db/schema';

const f = createUploadthing();

export const fileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  materiUploader: f(["image", "pdf", "audio"])
    // Set permissions and file types for this FileRoute
    .middleware(async ({ req }) => {
      // This code runs on your server before upload
      // const user = await auth(req);
      console.log(req.headers);
      // // If you throw, the user will not be able to upload
      // if (!user) throw new Error("Unauthorized");

			return { userId: session.user.id };
		})
		.onUploadComplete(async ({ metadata, file }) => {
			const [material] = await db
				.insert(materials)
				.values({
					title: file.name,
					fileKey: file.key,
					fileUrl: file.ufsUrl,
					fileName: file.name,
					mimeType: file.type,
					fileSize: file.size,
					uploadedBy: metadata.userId
				})
				.returning();
			return {
				materialId: material.id
			};
		})
} satisfies FileRouter;

export type fileRouter = typeof fileRouter;
