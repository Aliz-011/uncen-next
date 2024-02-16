import { DataTable } from '@/components/data-table';
import { Heading } from '@/components/heading';

import { db } from '@/lib/db';
import { columns } from './_components/columns';

const UserPage = async () => {
  const users = await db.user.findMany({
    select: {
      id: true,
      name: true,
      role: true,
      email: true,
    },
    orderBy: {
      name: 'asc',
    },
  });

  return (
    <div className="h-[calc(100vh-16rem)] flex-1">
      <Heading title="User management" subtitle="List of all users" />

      <div className="mt-6">
        <DataTable columns={columns} searchKey="name" data={users} />
      </div>
    </div>
  );
};

export default UserPage;
