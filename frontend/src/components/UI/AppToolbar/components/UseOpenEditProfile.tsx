import { create } from 'zustand';

type openProfileTypes = {
  isOpen: boolean;
  toggleOpen: () => void;
}

export const useOpenEditProfile = create<openProfileTypes>((set) => ({
  isOpen: false,
  toggleOpen: () => set((state) => ({ isOpen: !state.isOpen })), // С false в true и наоборот
}));
