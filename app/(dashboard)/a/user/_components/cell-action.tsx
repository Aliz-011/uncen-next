'use client';

import { useState } from 'react';
import {
  ClipboardCopyIcon,
  Pencil2Icon,
  DotsHorizontalIcon,
  TrashIcon,
} from '@radix-ui/react-icons';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { AlertModal } from '@/components/modals/alert-modal';
import { UserColumn } from './columns';

import { useCurrentUser } from '@/hooks/use-current-user';

interface CellActionProps {
  data: UserColumn;
}

export const CellAction = ({ data }: CellActionProps) => {
  const router = useRouter();
  const user = useCurrentUser();

  const [loading, setLoading] = useState(false);

  const onConfirm = async () => {
    try {
      setLoading(true);
      toast.success('Product deleted.');
      router.refresh();
    } catch (error) {
      toast.error(
        'Make sure you removed all products using this product first.'
      );
    } finally {
      setLoading(false);
    }
  };

  const onCopy = (id: string) => {
    navigator.clipboard.writeText(id);
    toast.success('User ID copied to clipboard.');
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <DotsHorizontalIcon className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-[160px]">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => onCopy(data.id!)}>
            <ClipboardCopyIcon className="mr-2 h-4 w-4" /> Copy Id
          </DropdownMenuItem>

          {user?.role === 'ADMIN' && (
            <>
              <DropdownMenuItem
                onClick={() =>
                  data.id === user.id
                    ? router.push(`/a/profile`)
                    : router.push(`/a/user/${data.id}`)
                }
              >
                <Pencil2Icon className="mr-2 h-4 w-4" /> Update
              </DropdownMenuItem>
              <DropdownMenuSeparator />

              <DropdownMenuItem>
                <TrashIcon className="mr-2 h-4 w-4" /> Delete
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
