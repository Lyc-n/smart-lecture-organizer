import { z } from 'zod';

export const CreateNoteSchema = z.object({
	title: z.string().min(1).max(255),
	content: z.string().min(1).max(10000),
	subjectId: z.uuid()
});

export const CreateDraftNoteSchema = z.object({
	subjectId: z.uuid().optional()
});

export const CreateMaterialNoteSchema = z.object({
	title: z.string().min(1).max(255).optional(),
	content: z.string().min(1).max(10000)
});

export const UpdateNoteSchema = z.object({
	title: z.string().min(1).max(255).optional(),
	content: z.string().max(10000).optional(),
	subjectId: z.uuid().optional()
});

export type CreateNoteInput = z.infer<typeof CreateNoteSchema>;
export type CreateDraftNoteInput = z.infer<typeof CreateDraftNoteSchema>;
export type CreateMaterialNoteInput = z.infer<typeof CreateMaterialNoteSchema>;
export type UpdateNoteInput = z.infer<typeof UpdateNoteSchema>;
