'use client';

import { useState, useTransition } from 'react';
import { useSearchParams } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
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
import { LoginSchema } from '@/lib/schemas';

import { login } from '@/actions/login';
import { cn } from '@/lib/utils';

export const LoginForm = () => {
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | undefined>(undefined);
  const [success, setSuccess] = useState<string | undefined>(undefined);
  const [isPending, startTransition] = useTransition();

  const urlError =
    searchParams.get('error') === 'OAuthAccountNotLinked'
      ? 'Email already in use with different provider!'
      : '';

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = (data: z.infer<typeof LoginSchema>) => {
    startTransition(() => {
      login(data).then((data) => {
        if (data.error) {
          form.resetField('password');
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
        <h1 className="text-3xl font-semibold">Login</h1>
        <span>Continue to your account</span>
      </div>
      {error && (
        <div
          className="p-4 w-full text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400"
          role="alert"
        >
          <span className="font-medium">{error}!</span>
        </div>
      )}
      {urlError && (
        <div
          className="p-4 w-full text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400"
          role="alert"
        >
          <span className="font-medium">{urlError}!</span>
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
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="yourmail@gmail.com"
                    {...field}
                    disabled={isPending}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" {...field} disabled={isPending} />
                </FormControl>
                <Button
                  variant="link"
                  className="px-0 font-normal"
                  size="sm"
                  asChild
                >
                  <Link href="/u/reset">Forgot password?</Link>
                </Button>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={isPending}>
            Continue
          </Button>
        </form>
      </Form>

      <div>
        Dont have an account, yet?{' '}
        <Link
          href="/u/register"
          className={cn(buttonVariants({ variant: 'link' }))}
        >
          Sign up here.
        </Link>
      </div>
    </div>
  );
};
