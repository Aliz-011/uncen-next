import { Heading } from '@/components/heading';
import { db } from '@/lib/db';
import { EmailForm } from './_components/email-form';
import { redirect } from 'next/navigation';
import { RoleForm } from './_components/role-form';

const UserIdPage = async ({ params }: { params: { userId: string } }) => {
  const user = await db.user.findUnique({
    where: {
      id: params.userId,
    },
  });

  if (!params.userId) {
    return redirect('/a/user');
  }

  if (!user) {
    return redirect('/a/user');
  }

  return (
    <div className="h-[calc(100vh-16rem)] flex-1">
      <Heading
        title="User's details"
        subtitle={`${user?.name}'s details information`}
      />

      <div className="flex flex-col space-y-4 mt-6">
        <EmailForm initialValue={user.email!} userId={user.id} />
        <RoleForm initialValue={user.role} userId={user.id} />
      </div>
    </div>
  );
};

export default UserIdPage;
