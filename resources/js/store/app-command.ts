import { create } from "zustand";

interface AppCommandStore {
    isOpen: boolean;
    setOpen: (isOpen: boolean) => void;
}

export const useAppCommandStore = create<AppCommandStore>((set) => ({
    isOpen: false,
    setOpen: (isOpen) => set({ isOpen }),
}));
