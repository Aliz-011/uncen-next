'use server';

import { z } from 'zod';

import { ResetSchema } from '@/lib/schemas';
import { getUserByEmail } from '@/lib/user';
import { sendPasswordResetEmail } from '@/lib/mail';
import { generatePasswordResetToken } from '@/lib/tokens';

export const reset = async (values: z.infer<typeof ResetSchema>) => {
  const validatedField = ResetSchema.safeParse(values);

  if (!validatedField.success) {
    return { error: 'Invalid email' };
  }

  const { email } = validatedField.data;

  const exisitingUser = await getUserByEmail(email);

  if (!exisitingUser) {
    return { error: 'Email does not exist' };
  }

  const passwordToken = await generatePasswordResetToken(email);
  await sendPasswordResetEmail(passwordToken.email, passwordToken.token);

  return { success: 'Reset email sent!' };
};
