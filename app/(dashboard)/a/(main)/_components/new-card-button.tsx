'use client';

import { PlusIcon } from '@radix-ui/react-icons';
import { useRouter } from 'next/navigation';

import { cn } from '@/lib/utils';

export const NewCardButton = () => {
  const router = useRouter();

  const onClick = () => {
    router.push('/a/letter/new');
  };

  return (
    <button
      className={cn(
        'col-span-1 aspect-[100/127] bg-orange-400 rounded-lg hover:bg-orange-500 flex flex-col items-center justify-center p-6'
      )}
      onClick={onClick}
    >
      <div />
      <PlusIcon className="h-10 w-10 text-white stroke-1" />
      <p className="text-xs text-white font-light">New letter</p>
    </button>
  );
};
