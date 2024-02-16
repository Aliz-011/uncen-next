'use client';

import Link from 'next/link';
import { UpdateIcon } from '@radix-ui/react-icons';
import { useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

import { buttonVariants } from '@/components/ui/button';

import { cn } from '@/lib/utils';
import { newVerification } from '@/actions/new-verification';

export const NewVerificationForm = () => {
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | undefined>(undefined);
  const [success, setSuccess] = useState<string | undefined>(undefined);

  const token = searchParams.get('token');

  const onSubmit = useCallback(() => {
    if (success || error) return;

    if (!token) {
      setError('Missing token');
      return;
    }

    newVerification(token)
      .then((data) => {
        setError(data.error);
        setSuccess(data.success);
      })
      .catch(() => {
        setError('Something went wrong');
      });
  }, [token, error, success]);

  useEffect(() => {
    onSubmit();
  }, [onSubmit]);

  return (
    <div className="flex flex-col items-center justify-center h-full w-2/3 mx-auto space-y-6">
      <div className="space-y-2 w-full flex flex-col items-center">
        <h1 className="text-3xl font-semibold">Confirm your verification</h1>
      </div>

      {!success && !error && <UpdateIcon className="h-8 w-8 animate-spin" />}
      <div className="md:w-1/3">
        {error && (
          <div
            className="p-4 w-full text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400"
            role="alert"
          >
            <span className="font-medium">{error}!</span>
          </div>
        )}
        {success && (
          <div
            className="p-4 w-full text-sm text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400"
            role="alert"
          >
            <span className="font-medium">{success}!</span>
          </div>
        )}
      </div>

      <div className="space-y-2 w-full flex flex-col items-center">
        <Link
          href="/u/login"
          className={cn(buttonVariants({ variant: 'default' }))}
        >
          Back to login
        </Link>
      </div>
    </div>
  );
};
