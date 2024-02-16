'use client';

import Link from 'next/link';
import {
  GearIcon,
  StackIcon,
  PersonIcon,
  PlusIcon,
} from '@radix-ui/react-icons';
import { useIsClient } from 'usehooks-ts';
import { usePathname } from 'next/navigation';

import { Button, buttonVariants } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

import { cn } from '@/lib/utils';

export const Sidebar = () => {
  const isClient = useIsClient();
  const pathname = usePathname();

  if (!isClient) {
    return <SidebarSkeleton />;
  }

  const routes = [
    {
      label: 'Dashboard',
      href: '/a',
      icon: <StackIcon className="h-4 w-4" />,
    },
    {
      label: 'Users',
      href: '/a/user',
      icon: <PersonIcon className="h-4 w-4" />,
    },
    {
      label: 'Settings',
      href: '/a/settings',
      icon: <GearIcon className="h-4 w-4" />,
    },
  ];

  return (
    <>
      <div className="font-medium text-xs flex items-center mb-1">
        <span className="pl-4">Workspaces</span>
        <TooltipProvider>
          <Tooltip delayDuration={50}>
            <TooltipTrigger className="ml-auto">
              <Button asChild type="button" size="icon" variant="ghost">
                <Link href="/a/letter/new">
                  <PlusIcon className="h-4 w-4" />
                </Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent>New letter</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <div className="flex flex-col space-y-2">
        {routes.map((route) => (
          <div
            className={cn(
              buttonVariants({
                variant: pathname === route.href ? 'secondary' : 'ghost',
              }),
              'inline-flex justify-start gap-x-2',
              pathname === route.href && 'text-orange-500'
            )}
            key={route.label}
          >
            {route.icon}
            <Link href={route.href} className="w-full">
              {route.label}
            </Link>
          </div>
        ))}
      </div>
    </>
  );
};

export const SidebarSkeleton = () => {
  return (
    <>
      <div className="font-medium text-xs flex items-center mb-1">
        <Skeleton className="pl-4 w-12 h-4" />
        <Skeleton className="ml-auto w-6 h-6" />
      </div>
      <div className="flex flex-col space-y-2 mt-2">
        {[...Array(3)].map((_, i) => (
          <div className="flex items-center gap-x-4" key={i}>
            <Skeleton className="h-6 w-8" />
            <Skeleton className="w-32 h-6" />
          </div>
        ))}
      </div>
    </>
  );
};
