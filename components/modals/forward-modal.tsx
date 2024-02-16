'use client';

import { useTransition } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { Status } from '@prisma/client';
import { toast } from 'sonner';
import * as z from 'zod';

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Modal } from '@/components/modals/modal';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { useForwardModal } from '@/hooks/use-forward-modal';
import { StatusSchema } from '@/lib/schemas';
import { updateLetterStatus } from '@/actions/update-letter';

type MailFormValues = z.infer<typeof StatusSchema>;

export const ForwardModal = () => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { isOpen, onClose, id } = useForwardModal((state) => state);

  const form = useForm<MailFormValues>({
    resolver: zodResolver(StatusSchema),
    defaultValues: {
      description: '',
    },
  });

  const handleForwardMessage = async (values: MailFormValues) => {
    startTransition(() => {
      updateLetterStatus(values, id!).then((data) => {
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

  return (
    <Modal title="Forward" isOpen={isOpen} onClose={onClose}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleForwardMessage)}>
          <div className="flex flex-col gap-4">
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a status of the letter" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={Status.RECEIVED}>Received</SelectItem>
                      <SelectItem value={Status.FORWARD}>Forward</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      disabled={isPending}
                      placeholder="e.g. Mail received"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    The status you set will be informed to the sender.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isPending} className="w-full">
              Continue
            </Button>
          </div>
        </form>
      </Form>
    </Modal>
  );
};
