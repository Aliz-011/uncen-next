'use server';

import { AuthError } from 'next-auth';
import { z } from 'zod';

import { signIn } from '@/auth';
import { LoginSchema } from '@/lib/schemas';
import { DEFAULT_LOGIN_REDIRECT } from '@/routes';
import { generateVerificationToken } from '@/lib/tokens';
import { getUserByEmail } from '@/lib/user';
import { sendVerificationMail } from '@/lib/mail';

export const login = async (
  data: z.infer<typeof LoginSchema>,
  callbackUrl?: string | null
) => {
  const validatedFields = LoginSchema.safeParse(data);

  if (!validatedFields.success) {
    return { error: 'Invalid fields' };
  }

  const { email, password } = validatedFields.data;

  const existingUser = await getUserByEmail(email);

  if (!existingUser || !existingUser.email || !existingUser.password) {
    return { error: 'Email does not exist' };
  }

  if (!existingUser.emailVerified) {
    const verificationToken = await generateVerificationToken(
      existingUser.email
    );

    await sendVerificationMail(
      verificationToken.email,
      verificationToken.token
    );

    return { success: 'Confirmation email sent' };
  }

  try {
    await signIn('credentials', {
      email,
      password,
      redirectTo: DEFAULT_LOGIN_REDIRECT,
    });

    return { success: 'Logged in successfully' };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return { error: 'Invalid credentials' };
        default:
          return { error: 'Something went wrong' };
      }
    }

    throw error;
  }
};
