import { LetterForm } from './_components/letter-form';

import { db } from '@/lib/db';

const LetterIdPage = async ({ params }: { params: { letterId: string } }) => {
  const letters = await db.letter.findUnique({
    where: {
      id: params.letterId,
    },
    include: {
      statuses: {
        where: {
          letterId: params.letterId,
        },
      },
      sender: {
        select: {
          name: true,
          role: true,
        },
      },
    },
  });

  return (
    <div className="h-[calc(100vh-16rem)] flex-1">
      <LetterForm initialData={letters} />
    </div>
  );
};

export default LetterIdPage;
