'use server';

import { z } from 'zod';
import { revalidatePath, revalidateTag } from 'next/cache';

import { db } from '@/lib/db';
import { StatusSchema } from '@/lib/schemas';
import { auth } from '@/auth';

export const updateLetterStatus = async (
  data: z.infer<typeof StatusSchema>,
  letterId: string
) => {
  const session = await auth();
  const validatedFields = StatusSchema.safeParse(data);

  if (!validatedFields.success) {
    return { error: 'Invalid fields' };
  }

  const { description, status } = validatedFields.data;

  if (!session?.user || !session.user.name) {
    return { error: 'Unauthorized' };
  }

  if (session.user.role === 'USER') {
    return { error: 'Regular user is not allowed to update this letter.' };
  }

  try {
    await db.letterStatus.create({
      data: {
        letterId,
        status,
        description,
        assignedBy: session.user.name,
      },
    });

    revalidatePath(`/a/letter/${letterId}`);
    revalidateTag(letterId);

    return { success: 'Letter successfully forwarded' };
  } catch (error: any) {
    return { error: error.message };
  }
};
