'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import * as z from 'zod';
import { toast } from 'sonner';
import { UserRole } from '@prisma/client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Pencil1Icon } from '@radix-ui/react-icons';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const formSchema = z.object({
  role: z.enum([UserRole.ADMIN, UserRole.BOSS, UserRole.USER], {
    required_error: 'You need to select a role to this user.',
  }),
});

interface RoleFormProps {
  initialValue: string;
  userId: string;
}

export const RoleForm = ({ initialValue, userId }: RoleFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const toggleEdit = () => setIsEditing((current) => !current);

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });
  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      toggleEdit();
      form.reset();
    } catch (error) {
      //
    }
  };

  return (
    <div className="border rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Role
        <Button variant={'ghost'} onClick={toggleEdit}>
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil1Icon className="h-4 w-4 mr-2" />
              Edit role
            </>
          )}
        </Button>
      </div>

      {!isEditing && (
        <p className="text-sm mt-2">current role: {initialValue}</p>
      )}
      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role to user" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={UserRole.ADMIN}>Admin</SelectItem>
                      <SelectItem value={UserRole.BOSS}>Boss</SelectItem>
                      <SelectItem value={UserRole.USER}>User</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
              <Button type="submit" disabled={isSubmitting || !isValid}>
                Save
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};
