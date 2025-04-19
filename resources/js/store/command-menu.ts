import { create } from "zustand";

interface CommandMenuStore {
    isOpen: boolean;
    setOpen: (isOpen: boolean) => void;
    toggleOpen: () => void;
}

export const useCommandMenuStore = create<CommandMenuStore>((set) => ({
    isOpen: false,
    setOpen: (isOpen) => set({ isOpen }),
    toggleOpen: () => set((state) => ({ isOpen: !state.isOpen })),
}));
