import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().trim().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, 'Name must be at least 3 characters')
    .max(50, 'Name must be at most 50 characters'),
  email: z.string().trim().email('Please enter a valid email address'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .max(128, 'Password must be at most 128 characters'),
});

export type RegisterFormValues = z.infer<typeof registerSchema>;

export const profileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, 'Name must be at least 3 characters')
    .max(50, 'Name must be at most 50 characters'),
  email: z.string().trim().email('Please enter a valid email address'),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;

export const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z
      .string()
      .min(6, 'Password must be at least 6 characters')
      .max(128, 'Password must be at most 128 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type PasswordFormValues = z.infer<typeof passwordSchema>;

const optionalUrlSchema = z
  .string()
  .trim()
  .refine(
    (val) => val === '' || /^https?:\/\/[\w.-]+(\.[\w.-]+)+(\/[\w\-._~:/?#[\]@!$&'()*+,;=.]*)?$/i.test(val),
    'Please enter a valid http(s) URL'
  );

const optionalEmailSchema = z
  .string()
  .trim()
  .refine((val) => val === '' || z.string().email().safeParse(val).success, 'Please enter a valid email');

export const jobFormSchema = z.object({
  company: z.string().trim().min(1, 'Company is required').max(50, 'Max 50 characters'),
  position: z.string().trim().min(1, 'Position is required').max(100, 'Max 100 characters'),
  status: z.enum(['pending', 'interview', 'declined', 'offer', 'accepted']),
  priority: z.enum(['high', 'medium', 'low']),
  location: z.string().trim().max(100, 'Max 100 characters').default(''),
  jobType: z.enum(['remote', 'hybrid', 'onsite']).optional(),
  salary: z.string().trim().max(100, 'Max 100 characters').default(''),
  jobUrl: optionalUrlSchema.default(''),
  description: z.string().trim().max(5000, 'Max 5000 characters').default(''),
  appliedDate: z.string().default(''),
  interviewDate: z.string().default(''),
  tags: z.array(z.string()).default([]),
  contactName: z.string().trim().max(100, 'Max 100 characters').default(''),
  contactEmail: optionalEmailSchema.default(''),
});

export type JobFormValues = z.infer<typeof jobFormSchema>;
