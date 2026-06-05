import { createUploadthing, type FileRouter } from "uploadthing/server";
import { auth } from "./auth";
import { db } from "./db";
import { materials } from "./db/schema";

const f = createUploadthing();

export const fileRouter = {
  // Allow type file
  materiUploader: f(["image", "pdf", "audio"])
    .middleware(async ({req}) => {
      // get user session
      const session = await auth.api.getSession({headers: req.headers});

      if(!session){ throw new Error('Unauthorized')};

      return { userId: session.user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      const [material] = await db.insert(materials).values({
					title: file.name,
					fileKey: file.key,
					fileUrl: file.ufsUrl,
					fileName: file.name,
					mimeType: file.type,
					fileSize: file.size,
					uploadedBy: metadata.userId
      }).returning();
      return {
        materialId: material.id
      }
    }),
} satisfies FileRouter;

export type fileRouter = typeof fileRouter;
