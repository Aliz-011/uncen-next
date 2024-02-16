'use server';

import { z } from 'zod';
import bcrypt from 'bcryptjs';

import { RegisterSchema } from '@/lib/schemas';
import { getUserByEmail } from '@/lib/user';
import { db } from '@/lib/db';
import { generateVerificationToken } from '@/lib/tokens';
import { sendVerificationMail } from '@/lib/mail';

export const register = async (data: z.infer<typeof RegisterSchema>) => {
  const validatedFields = RegisterSchema.safeParse(data);

  if (!validatedFields.success) {
    return { error: 'Invalid fields' };
  }

  const { email, password, name } = validatedFields.data;

  const existingUser = await getUserByEmail(email);

  if (existingUser) {
    return { error: 'User with this email already exists' };
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  try {
    await db.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
      },
    });

    const verificationToken = await generateVerificationToken(email);
    await sendVerificationMail(
      verificationToken.email,
      verificationToken.token
    );

    return { success: 'Confirmation email sent!' };
  } catch (error) {
    return { error: 'Something went wrong' };
  }
};
