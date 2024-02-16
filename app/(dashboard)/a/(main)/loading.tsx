import { HeadingSkeleton } from '@/components/heading';
import { LetterCardSkeleton } from './_components/letter-card';

const Loading = () => {
  return (
    <div className="h-[calc(100vh-16rem)] flex-1">
      <HeadingSkeleton />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-5 mt-8 pb-10">
        <LetterCardSkeleton />
      </div>
    </div>
  );
};

export default Loading;
