import { z } from 'zod';

export const CreateNoteSchema = z.object({
	materialId: z.string().nullable().optional(),
	title: z.string().min(3).max(255),
	content: z.string().min(1).max(10000)
});

export const UpdateNoteSchema = CreateNoteSchema.partial();

export type CreateNoteInput = z.infer<typeof CreateNoteSchema>;

export type UpdateNoteInput = z.infer<typeof UpdateNoteSchema>;
