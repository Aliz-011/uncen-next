'use client';

import { useState, useTransition } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { signIn } from 'next-auth/react';
import { toast } from 'sonner';
import { z } from 'zod';
import Image from 'next/image';
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

import { RegisterSchema } from '@/lib/schemas';
import { register } from '@/actions/register';
import { cn } from '@/lib/utils';

export const RegisterForm = () => {
  const router = useRouter();
  const [error, setError] = useState<string | undefined>(undefined);
  const [success, setSuccess] = useState<string | undefined>(undefined);
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: '',
      password: '',
      name: '',
    },
  });

  const onSubmit = (data: z.infer<typeof RegisterSchema>) => {
    startTransition(() => {
      register(data).then((data) => {
        setSuccess(data.success);
        setError(data.error);
      });
    });
  };
  return (
    <div className="flex flex-col items-center justify-center h-full w-2/3 md:w-1/3 mx-auto space-y-8">
      <div className="space-y-2 w-full flex flex-col items-center">
        <h1 className="text-3xl font-semibold">Register</h1>
        <span>Create your account</span>
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
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="your name..."
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
        Already have an account?{' '}
        <Link
          href="/u/login"
          className={cn(buttonVariants({ variant: 'link' }))}
        >
          Sign in here.
        </Link>
      </div>
    </div>
  );
};
