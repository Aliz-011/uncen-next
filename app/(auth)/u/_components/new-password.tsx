'use client';

import { useState, useTransition } from 'react';
import { useSearchParams } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import Link from 'next/link';

import { Button, buttonVariants } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { NewPasswordSchema } from '@/lib/schemas';
import { cn } from '@/lib/utils';
import { newPassword } from '@/actions/new-password';

export const NewPasswordForm = () => {
  const searchParams = useSearchParams();

  const [error, setError] = useState<string | undefined>(undefined);
  const [success, setSuccess] = useState<string | undefined>(undefined);
  const [isPending, startTransition] = useTransition();

  const token = searchParams.get('token');

  const form = useForm<z.infer<typeof NewPasswordSchema>>({
    resolver: zodResolver(NewPasswordSchema),
    defaultValues: {
      password: '',
    },
  });

  const onSubmit = (data: z.infer<typeof NewPasswordSchema>) => {
    startTransition(() => {
      newPassword(data, token).then((data) => {
        if (data.error) {
          form.reset();
          setError(data.error);
        }

        if (data.success) {
          form.reset();
          setSuccess(data.success);
        }
      });
    });
  };

  return (
    <div className="flex flex-col items-center justify-center h-full w-2/3 md:w-1/3 mx-auto space-y-6">
      <div className="space-y-2 w-full flex flex-col items-center">
        <h1 className="text-3xl font-semibold">Enter new password</h1>
      </div>
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
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 w-full"
        >
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" {...field} disabled={isPending} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={isPending}>
            Reset password
          </Button>
        </form>
      </Form>

      <Link href="/u/login" className={cn(buttonVariants({ variant: 'link' }))}>
        Back to login
      </Link>
    </div>
  );
};
