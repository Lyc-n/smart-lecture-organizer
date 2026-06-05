import { z } from 'zod';

export const CreateMaterialSchema = z.object({
	title: z.string().min(3).max(255),
	description: z.string().optional(),
	subjectId: z.string(),
	meetingId: z.string(),
	status: z.enum(['pending', 'processed', 'failed']).optional(),
	category: z.string().optional(),
	fileName: z.string().min(3).max(255),
	mimeType: z.string().min(1),
	fileSize: z.number().positive(),
	blobPath: z.string().min(1)
});

export const UpdateMaterialSchema = CreateMaterialSchema.partial();

export type CreateMaterialInput = z.infer<typeof CreateMaterialSchema>;
export type UpdateMaterialInput = z.infer<typeof UpdateMaterialSchema>;