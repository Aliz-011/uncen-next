'use server';

import { z } from 'zod';
import bcrypt from 'bcryptjs';

import { getPasswordResetByToken } from '@/lib/password-reset-token';
import { NewPasswordSchema } from '@/lib/schemas';
import { getUserByEmail } from '@/lib/user';
import { db } from '@/lib/db';

export const newPassword = async (
  data: z.infer<typeof NewPasswordSchema>,
  token?: string | null
) => {
  const validatedField = NewPasswordSchema.safeParse(data);

  if (!token) {
    return { error: 'Token not found' };
  }

  if (!validatedField.success) {
    return { error: 'Invalid fields' };
  }

  const { password } = validatedField.data;

  const exisitingToken = await getPasswordResetByToken(token);

  if (!exisitingToken) {
    return { error: 'Invalid token' };
  }

  const hasExpires = new Date(exisitingToken.expires) < new Date();

  if (hasExpires) {
    return { error: 'Token expired' };
  }

  const existingUser = await getUserByEmail(exisitingToken.email);

  if (!existingUser) {
    return { error: 'Email does not exist' };
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  await db.user.update({
    where: {
      id: existingUser.id,
    },
    data: {
      password: hashedPassword,
    },
  });

  await db.passwordResetToken.delete({
    where: {
      id: exisitingToken.id,
    },
  });

  return { success: 'Password reseted successfully' };
};
