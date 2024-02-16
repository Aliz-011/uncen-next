import { Skeleton } from '@/components/ui/skeleton';

import { cn } from '@/lib/utils';

export const Heading = ({
  title,
  subtitle,
  center,
}: {
  title: string;
  subtitle?: string;
  center?: boolean;
}) => {
  return (
    <div
      className={cn(
        'flex flex-col gap-y-2',
        center && 'items-center justify-center'
      )}
    >
      <h1 className="font-semibold text-2xl">{title}</h1>
      <span className="text-muted-foreground text-sm">{subtitle}</span>
    </div>
  );
};

export const HeadingSkeleton = () => {
  return (
    <div className="flex flex-col gap-y-4">
      <Skeleton className="h-8 w-[60px]" />
      <Skeleton className="h-4 w-[100px]" />
    </div>
  );
};
