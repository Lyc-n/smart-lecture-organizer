import { z } from 'zod';

export const CreateSubjectSchema = z.object({
	name: z.string().min(3).max(255),
	description: z.string().optional()
});

export const UpdateSubjectSchema = CreateSubjectSchema.partial();

export type CreateSubjectInput = z.infer<typeof CreateSubjectSchema>;

export type UpdateSubjectInput = z.infer<typeof UpdateSubjectSchema>;
