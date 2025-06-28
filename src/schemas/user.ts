import { z } from 'zod';

export const createUserSchema = z.object({
  first_name: z
    .string()
    .min(1, 'First name is required')
    .max(100, 'First name must be less than 100 characters'),
  last_name: z
    .string()
    .min(1, 'Last name is required')
    .max(100, 'Last name must be less than 100 characters'),
  email: z.string().email('Invalid email address'),
});

export const updateUserSchema = z.object({
  first_name: z
    .string()
    .min(1, 'First name is required')
    .max(100, 'First name must be less than 100 characters'),
  last_name: z
    .string()
    .min(1, 'Last name is required')
    .max(100, 'Last name must be less than 100 characters'),
  email: z.string().email('Invalid email address'),
});

export const userIdSchema = z.string().min(1, 'User ID is required');

export type CreateUserFormData = z.infer<typeof createUserSchema>;
export type UpdateUserFormData = z.infer<typeof updateUserSchema>;
export type UserId = z.infer<typeof userIdSchema>;
