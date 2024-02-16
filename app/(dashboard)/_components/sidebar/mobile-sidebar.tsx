'use client';

import { useEffect, useState } from 'react';
import { HamburgerMenuIcon } from '@radix-ui/react-icons';
import { useMediaQuery } from 'usehooks-ts';

import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Sidebar } from '.';

export const MobileSidebar = () => {
  const matches = useMediaQuery('(min-width: 768px)');
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (matches) {
      setOpen(false);
    }
  }, [matches]);

  return (
    <Sheet open={open} onOpenChange={(val) => setOpen(val)}>
      <SheetTrigger asChild>
        <Button size="sm" className="rounded-sm md:hidden block">
          <HamburgerMenuIcon className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="px-0">
        <div className="w-full py-8">
          <Sidebar />
        </div>
      </SheetContent>
    </Sheet>
  );
};
