import { Status } from '@prisma/client';
import { EmptyLetter } from './_components/empty-letter';
import { LetterCard } from './_components/letter-card';

import { NewCardButton } from './_components/new-card-button';
import { db } from '@/lib/db';
import { CategoryItem } from './_components/category-item';

export const revalidate = 0; // revalidate at most every hour

export default async function Home({
  searchParams,
}: {
  searchParams: { categoryId: string };
}) {
  const data = await db.letter.findMany({
    include: {
      statuses: true,
      sender: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  if (!data.length) {
    return (
      <div className="h-[calc(100vh-16rem)] flex-1">
        <EmptyLetter />
      </div>
    );
  }

  const categories = [
    {
      label: 'Sent',
      value: Status.SENT,
    },
    {
      label: 'Forwarded',
      value: Status.FORWARD,
    },
    {
      label: 'Received',
      value: Status.RECEIVED,
    },
  ];

  return (
    <div className="h-[calc(100vh-16rem)] flex-1">
      {/* <div className="flex items-center gap-x-2 overflow-x-auto">
        {categories.map((category) => (
          <CategoryItem
            label={category.label}
            value={category.value}
            key={category.label}
          />
        ))}
      </div> */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-5 mt-8 pb-10">
        <NewCardButton />
        {data.map((item) => (
          <LetterCard key={item.id} data={item} />
        ))}
      </div>
    </div>
  );
}
