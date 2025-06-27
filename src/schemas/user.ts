import { z } from 'zod';

export const createUserSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
  job: z.string().min(1, 'Job is required').max(100, 'Job must be less than 100 characters'),
});

export const updateUserSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
  job: z.string().min(1, 'Job is required').max(100, 'Job must be less than 100 characters'),
});

export const userIdSchema = z.string().min(1, 'User ID is required');

export type CreateUserFormData = z.infer<typeof createUserSchema>;
export type UpdateUserFormData = z.infer<typeof updateUserSchema>;
export type UserId = z.infer<typeof userIdSchema>;
