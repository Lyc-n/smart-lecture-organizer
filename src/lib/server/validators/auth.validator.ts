import { z } from 'zod';

export const RegisterSchema = z.object({
	name: z.string().min(3).max(100),

	email: z.email(),

	password: z.string().min(8)
});

export type RegisterInput = z.infer<typeof RegisterSchema>;

export const LoginSchema = z.object({
	email: z.email(),
	password: z.string().min(8)
});

export type LoginInput = z.infer<typeof LoginSchema>;
