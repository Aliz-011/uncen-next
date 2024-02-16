'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useIsClient } from 'usehooks-ts';
import { InfoCircledIcon, CheckCircledIcon } from '@radix-ui/react-icons';
import { formatDistanceToNow } from 'date-fns';
import { Letter, LetterStatus, Status } from '@prisma/client';

import { Skeleton } from '@/components/ui/skeleton';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

import { cn } from '@/lib/utils';
import { useCurrentUser } from '@/hooks/use-current-user';

interface LetterCardProps {
  data: Letter & {
    statuses: LetterStatus[] | null;
    sender: { name: string | null };
  };
}

export const LetterCard = ({ data }: LetterCardProps) => {
  const user = useCurrentUser();
  const isClient = useIsClient();
  const disabled = true;

  const lastIndex = data.statuses?.length! - 1;
  const author = data.senderId === user?.id ? 'You' : data.sender.name;

  if (!isClient) {
    return <LetterCardSkeleton />;
  }

  return (
    <Link href={`/a/letter/${data.id}`}>
      <div className="group aspect-[100/127] border rounded-lg flex flex-col justify-between overflow-hidden">
        <div className="relative flex-1 bg-amber-50">
          <Image src={data.coverImg} alt="doodle" fill className="object-fit" />
          <div className="opacity-0 group-hover:opacity-50 transition-opacity h-full w-full bg-black" />
        </div>

        <div className="relative p-3">
          <p className="text-[13px] truncate max-w-[calc(100%-20px)]">
            {data.title}
          </p>
          <p className="opacity-0 group-hover:opacity-100 transition-opacity text-[11px] text-muted-foreground truncate">
            {author},{' '}
            {formatDistanceToNow(new Date(data.createdAt), {
              addSuffix: true,
              includeSeconds: true,
            })}
          </p>
          <button
            disabled={disabled}
            className={cn(
              'opacity-0 group-hover:opacity-100 transition absolute top-3 right-3 text-muted-foreground hover:text-orange-600',
              disabled && 'cursor-not-allowed opacity-75'
            )}
          >
            <TooltipProvider>
              <Tooltip delayDuration={50}>
                <TooltipTrigger>
                  {data.statuses![lastIndex].status === Status.RECEIVED ? (
                    <CheckCircledIcon className="h-4 w-4" />
                  ) : (
                    <InfoCircledIcon className="h-4 w-4" />
                  )}
                </TooltipTrigger>
                <TooltipContent>
                  <p className="capitalize">
                    {data.statuses![lastIndex].status}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </button>
        </div>
      </div>
    </Link>
  );
};

export function LetterCardSkeleton() {
  return (
    <div className="aspect-[100/127] border rounded-lg flex flex-col justify-between overflow-hidden">
      <div className="relative flex-1">
        <Skeleton className="h-full w-full" />
      </div>

      <div className="relative p-3">
        <Skeleton className="w-8 h-4" />
        <Skeleton className="w-14 h-4" />
      </div>
    </div>
  );
}
