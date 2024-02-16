'use client';

import { useIsClient } from 'usehooks-ts';

import { ForwardModal } from '@/components/modals/forward-modal';

export const ModalProvider = () => {
  const isClient = useIsClient();

  if (!isClient) {
    return null;
  }

  return (
    <>
      <ForwardModal />
    </>
  );
};
