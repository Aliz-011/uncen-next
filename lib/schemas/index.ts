import { Status } from '@prisma/client';
import { z } from 'zod';

export const ResetSchema = z.object({
  email: z.string().email(),
});

export const NewPasswordSchema = z.object({
  password: z.string().min(6),
});

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const RegisterSchema = z.object({
  email: z.string().email(),
  name: z.string().min(5),
  password: z.string().min(6),
});

export const LetterSchema = z.object({
  title: z.string().min(4),
  code: z.string().min(4),
  senderId: z.string().min(1),
  content: z.string().min(10),
  attachment: z.optional(z.string()),
});

export const StatusSchema = z.object({
  description: z.string().min(8, {
    message: 'Description at least 8 characters',
  }),
  status: z.enum([Status.FORWARD, Status.RECEIVED]),
});
