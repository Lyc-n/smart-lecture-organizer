import { z } from 'zod';

export const CreateMaterialSchema = z.object({
	title: z.string().min(3).max(255),
	description: z.string().optional(),
	fileUrl: z.string(),
	fileType: z.enum(['pdf', 'docx', 'pptx', 'xlsx', 'txt', 'ppt', 'jpg', 'png', 'mp4', 'mp3', 'zip', 'rar', 'wav', 'other'])
});

export const UpdateMaterialSchema = CreateMaterialSchema.partial();

export type CreateMaterialInput = z.infer<typeof CreateMaterialSchema>;
export type UpdateMaterialInput = z.infer<typeof UpdateMaterialSchema>;
