'use client';

import { useRouter } from 'next/navigation';
import { Share1Icon } from '@radix-ui/react-icons';
import { useTransition } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Letter, LetterStatus } from '@prisma/client';
import * as z from 'zod';
import { toast } from 'sonner';
import { format, formatDistanceToNow } from 'date-fns';
import Link from 'next/link';
import Image from 'next/image';

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Heading } from '@/components/heading';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import {
  Tooltip,
  TooltipProvider,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

import { LetterSchema } from '@/lib/schemas';
import { useCurrentUser } from '@/hooks/use-current-user';
import { createLetter } from '@/actions/create-letter';
import { useForwardModal } from '@/hooks/use-forward-modal';

interface LetterFormProps {
  initialData:
    | (Letter & {
        statuses: LetterStatus[];
        sender: { name: string | null; role: string | null };
      })
    | null;
}

export const LetterForm = ({ initialData }: LetterFormProps) => {
  const user = useCurrentUser();
  const [isPending, startTransition] = useTransition();

  const { onOpen } = useForwardModal((state) => state);

  const form = useForm<z.infer<typeof LetterSchema>>({
    resolver: zodResolver(LetterSchema),
    defaultValues: {
      code: '',
      title: '',
      content: '',
      senderId: user?.id,
    },
  });

  const onSubmit = async (data: z.infer<typeof LetterSchema>) => {
    startTransition(() => {
      createLetter(data).then((data) => {
        if (data.error) {
          toast.error(data.error);
          return;
        }

        if (data.success) {
          toast.success(data.success);
          form.reset();
          return;
        }
      });
    });
  };

  const action = initialData ? 'Save changes' : 'Create';

  return (
    <>
      <Heading title={initialData ? 'Letter statuses' : 'New letter'} />

      {initialData && (
        <div className="mt-4">
          <Tabs defaultValue="mail">
            <div className="flex items-center p-2">
              <TabsList className="grid grid-cols-2 gap-2 w-[400px]">
                <TabsTrigger
                  value="mail"
                  className="text-zinc-600 dark:text-zinc-200"
                >
                  Mail
                </TabsTrigger>
                <TabsTrigger
                  value="status"
                  className="text-zinc-600 dark:text-zinc-200"
                >
                  Status
                </TabsTrigger>
              </TabsList>
              {initialData.senderId !== user?.id && (
                <div className="ml-auto flex items-center gap-2">
                  <TooltipProvider delayDuration={0}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          disabled={!initialData}
                          onClick={() => onOpen(initialData.id)}
                        >
                          <Share1Icon className="h-4 w-4" />
                          <span className="sr-only">Forward</span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Forward</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              )}
            </div>

            <TabsContent value="mail" className="m-0">
              {initialData && (
                <div className="flex flex-1 flex-col">
                  <div className="flex items-start p-4">
                    <div className="flex items-start gap-4 text-sm">
                      <Avatar>
                        <AvatarImage src="/placeholder.jpg" alt="kl" />
                        <AvatarFallback className="uppercase">
                          {initialData.sender
                            .name!.split(' ')
                            .map((chunk) => chunk[0])
                            .join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="grid gap-1">
                        <div className="font-semibold">
                          {initialData.sender.name}
                        </div>
                        <div className="line-clamp-1 text-xs">
                          {initialData.title}
                        </div>
                        <div className="line-clamp-1 text-xs">
                          Letter code:&nbsp;
                          <span className="font-medium">
                            {initialData.code}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="ml-auto text-xs text-muted-foreground">
                      {format(new Date(initialData.createdAt), 'PPpp')}
                    </div>
                  </div>

                  <Separator />

                  <div className="flex-1 whitespace-pre-wrap p-4 text-sm">
                    {initialData.content}
                  </div>
                  <div className="p-4 w-full">
                    {initialData?.attachment && (
                      <>
                        <Link
                          href={initialData.attachment}
                          target="_blank"
                          className="text-blue-500 hover:underline hover:text-gray-900 transition text-sm"
                        >
                          Attachment
                        </Link>
                        <Image
                          src={initialData.attachment}
                          alt={initialData.title}
                          width={400}
                          height={400}
                          className="aspect-video object-cover"
                        />
                      </>
                    )}
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="status" className="m-0">
              <div className="flex-1 rounded-lg p-6">
                <h4 className="text-xl font-bold">Timeline</h4>

                <div className="relative px-4">
                  <div className="absolute h-full border border-dashed border-opacity-70 border-secondary" />
                  {initialData?.statuses.map((timeline) => (
                    <div
                      className="flex items-center w-full my-6 -ml-1.5"
                      key={`${timeline.letterId}${timeline.id}`}
                    >
                      <div className="w-1/12 z-10">
                        <div className="w-3.5 h-3.5 bg-orange-600 rounded-full" />
                      </div>
                      <div className="w-11/12">
                        <p className="text-sm">{timeline.description}</p>
                        <p className="text-xs text-gray-500">
                          {formatDistanceToNow(new Date(timeline.createdAt), {
                            addSuffix: true,
                            includeSeconds: true,
                          })}{' '}
                          by {timeline.assignedBy}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      )}

      {!initialData && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-6 space-y-4"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Title <sup className="text-red-500">*</sup>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Title..."
                      disabled={isPending}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Letter Code <sup className="text-red-500">*</sup>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g NL-2002-24"
                      disabled={isPending}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>This field must be unique.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <Textarea
                      disabled={isPending}
                      placeholder="The purpose of this mail"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isPending || !!initialData}>
              {action}
            </Button>
          </form>
        </Form>
      )}
    </>
  );
};
