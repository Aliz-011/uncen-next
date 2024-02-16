import { db } from './db';

export const getPasswordResetByToken = async (token: string) => {
  try {
    const passwordToken = await db.passwordResetToken.findUnique({
      where: { token },
    });

    return passwordToken;
  } catch (error) {
    return null;
  }
};

export const getPasswordResetByEmail = async (email: string) => {
  try {
    const passwordToken = await db.passwordResetToken.findFirst({
      where: { email },
    });

    return passwordToken;
  } catch (error) {
    return null;
  }
};
