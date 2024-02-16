'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogPortal,
  DialogTitle,
} from '@/components/ui/dialog';

interface ModalProps {
  isOpen: boolean;
  onClose: (open: boolean) => void;
  title: string;
  description?: string;
  children: React.ReactNode;
}

export const Modal = ({
  title,
  description,
  isOpen,
  onClose,
  children,
}: ModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogPortal>
        <DialogContent
          className="
            fixed 
            drop-shadow-md 
            border 
            top-[50%] 
            left-[50%] 
            max-h-full 
            h-full 
            md:h-auto 
            md:max-h-[85vh]
            w-full
            md:w-auto
            md:min-w-[30vw]
            md:max-w-[750px] 
            translate-x-[-50%] 
            translate-y-[-50%] 
            rounded-md 
            p-[25px] 
            focus:outline-none
          "
        >
          <DialogHeader>
            <DialogTitle className="text-center">{title}</DialogTitle>
            <DialogDescription
              className=" 
              text-sm 
              leading-normal 
              text-center
            "
            >
              {description}
            </DialogDescription>
          </DialogHeader>

          <div className="w-full">{children}</div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
};
