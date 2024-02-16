'use client';

import { useEffect, useState, useTransition } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import qs from 'query-string';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ModeToggle } from '@/components/mode-toggle';
import { Avatar, AvatarImage } from '@/components/ui/avatar';

import { useCurrentUser } from '@/hooks/use-current-user';
import { logout } from '@/actions/logout';
import { MobileSidebar } from '../sidebar/mobile-sidebar';
import { Logo } from '@/components/logo';
import { MagnifyingGlassIcon } from '@radix-ui/react-icons';
import { Input } from '@/components/ui/input';
import { useDebouce } from '@/hooks/use-debounce';

export const Navbar = () => {
  const router = useRouter();
  const user = useCurrentUser();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [value, setValue] = useState('');
  const [isPending, startTransition] = useTransition();

  const debouncedValue = useDebouce(value);

  const currentCategoryId = searchParams.get('categoryId');

  const actionLogout = () => {
    startTransition(() => {
      logout().then(() => {});
    });
  };

  useEffect(() => {
    const url = qs.stringifyUrl(
      {
        url: pathname,
        query: {
          categoryId: currentCategoryId,
          title: debouncedValue,
        },
      },
      { skipNull: true, skipEmptyString: true }
    );

    router.push(url);
  }, [debouncedValue, currentCategoryId, router, pathname]);

  return (
    <nav className="fixed z-50 top-0 px-4 w-full h-14 bg-background border-b shadow-sm flex items-center">
      <div className="flex items-center gap-x-4">
        <div className="hidden md:flex">
          <Logo />
        </div>

        <MobileSidebar />
      </div>

      <div className="ml-auto flex items-center gap-x-4">
        <div className="rounded-full bg-slate-100 dark:bg-slate-800 flex items-center ">
          <MagnifyingGlassIcon className="h-4 w-4 ml-2 text-slate-600 dark:text-slate-100" />
          <Input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-full md:w-[300px] rounded-full shadow-none border-none focus-visible:ring-0"
            placeholder="Search a course..."
          />
        </div>
        <ModeToggle />

        <DropdownMenu>
          <DropdownMenuTrigger className="cursor-pointer h-8 w-8" asChild>
            <Avatar>
              <AvatarImage
                src={user?.image ? user?.image : '/placeholder.jpg'}
              />
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user?.name}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user?.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push('/a/profile')}>
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem>Billing</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer" asChild>
              <form action={actionLogout} className="w-full">
                <button type="submit" className="w-full text-start">
                  Log out
                </button>
              </form>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
};
