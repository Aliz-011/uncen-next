import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Link from 'next/link';

const ErrorPage = () => {
  return (
    <main className="h-full w-full">
      <div className="flex flex-col items-center justify-center h-full w-2/3 mx-auto space-y-6">
        <div className="space-y-4 w-full flex flex-col items-center">
          <h1 className="text-3xl font-semibold">Oops, something went wrong</h1>
          <Link
            href="/u/login"
            className={cn(buttonVariants({ variant: 'secondary' }))}
          >
            Back to login
          </Link>
        </div>
      </div>
    </main>
  );
};

export default ErrorPage;
