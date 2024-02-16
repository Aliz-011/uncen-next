import { PrismaClient, UserRole } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('lament999', 12);

  const admin = await prisma.user.create({
    data: {
      email: 'admin@lament.com',
      name: 'admin',
      password: hashedPassword,
      role: UserRole.ADMIN,
      emailVerified: new Date(),
    },
  });

  console.log({ admin });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
