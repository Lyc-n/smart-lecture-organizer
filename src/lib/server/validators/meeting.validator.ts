import { z } from 'zod';

export const CreateMeetingSchema = z.object({
	subjectId: z.string().nullable().optional(),
	weekNumber: z.number().int().min(1).max(16),
	title: z.string().min(3).max(255),
	description: z.string().optional()
});

export const UpdateMeetingSchema = CreateMeetingSchema.partial();

export type CreateMeetingInput = z.infer<typeof CreateMeetingSchema>;

export type UpdateMeetingInput = z.infer<typeof UpdateMeetingSchema>;
