import { type z } from "zod";
import { create } from "zustand";

import { type accountTypeEnum } from "#/schemas/account.ts";

interface CreateAccountWizardState {
    type: z.infer<typeof accountTypeEnum> | null;
    setType: (type: z.infer<typeof accountTypeEnum>) => void;
}

export const useCreateAccountWizardStore = create<CreateAccountWizardState>()((set) => ({
    type: null,
    setType: (type) => set({ type }),
}));
