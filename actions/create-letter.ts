'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';

import { LetterSchema } from '@/lib/schemas';
import { db } from '@/lib/db';
import { auth } from '@/auth';

export const createLetter = async (values: z.infer<typeof LetterSchema>) => {
  const session = await auth();
  const validatedFields = LetterSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: 'Invalid fields' };
  }

  const { code, senderId, title, content } = validatedFields.data;

  if (!session?.user || !session.user.name) {
    return { error: 'Unauthorized' };
  }

  const images = [
    '/placeholders/1.svg',
    '/placeholders/2.svg',
    '/placeholders/3.svg',
    '/placeholders/4.svg',
    '/placeholders/5.svg',
    '/placeholders/6.svg',
    '/placeholders/7.svg',
    '/placeholders/8.svg',
    '/placeholders/9.svg',
    '/placeholders/10.svg',
  ];

  const randomImages = images[Math.floor(Math.random() * images.length)];

  try {
    await db.letter.create({
      data: {
        title,
        code,
        content,
        senderId,
        coverImg: randomImages,
        statuses: {
          create: {
            description: 'Surat dibuat dan sudah dikirimkan.',
            assignedBy: session.user.name,
          },
        },
      },
    });

    revalidatePath(`/a/letter/new`);

    return { success: 'Letter created!' };
  } catch (error: any) {
    return { error: error.message };
  }
};
