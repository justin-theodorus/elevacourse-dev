import { z } from 'zod';

export const registerSchema = z.object({
	email: z.string().email({ message: 'Invalid email address' }),
	password: z
		.string()
		.min(8, { message: 'Password must be at least 8 characters' })
		.regex(/[A-Z]/, { message: 'Password must contain an uppercase letter' })
		.regex(/[0-9]/, { message: 'Password must contain a number' })
		.regex(/[^A-Za-z0-9]/, { message: 'Password must contain a symbol' }),
});

export const loginSchema = z.object({
	email: z.string().email({ message: 'Invalid email address' }),
	password: z.string().min(1, { message: 'Password is required' }),
});
