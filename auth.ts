import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { UserRole } from '@prisma/client';

import authConfig from '@/auth.config';
import { db } from '@/lib/db';
import { getUserById } from '@/lib/user';

export const {
  handlers: { GET, POST },
  signIn,
  signOut,
  update,
  auth,
} = NextAuth({
  adapter: PrismaAdapter(db),
  events: {
    async linkAccount({ user }) {
      await db.user.update({
        where: { id: user.id },
        data: {
          emailVerified: new Date(),
        },
      });
    },
  },
  callbacks: {
    async signIn({ user, account }) {
      // allow oauth without verifying email
      if (account?.provider !== 'credentials') return true;

      const existingUser = await getUserById(user.id);

      // prevent sign in without verifying email
      if (!existingUser?.emailVerified) return false;

      return true;
    },
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

      if (token.role && session.user) {
        session.user.role = token.role as UserRole;
      }

      return session;
    },
    async jwt({ token }) {
      if (!token.sub) return token;

      const existingUser = await getUserById(token.sub);

      if (!existingUser) return token;

      token.role = existingUser.role;

      return token;
    },
  },
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/u/login',
    error: '/u/error',
  },
  ...authConfig,
});
