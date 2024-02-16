import { create } from 'zustand';

interface ForwardModalStore {
  isOpen: boolean;
  id?: string | null;
  onOpen: (val: string) => void;
  onClose: () => void;
}

export const useForwardModal = create<ForwardModalStore>((set) => ({
  isOpen: false,
  onOpen: (val: string) => set({ isOpen: true, id: val }),
  onClose: () => set({ isOpen: false }),
}));
