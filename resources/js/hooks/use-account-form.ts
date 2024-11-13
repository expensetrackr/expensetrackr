import { useForm } from "@inertiajs/react";

import { type AccountFormData, AccountType } from "#/models/account.ts";

export function useAccountForm(initialData?: Partial<AccountFormData>) {
    return useForm<AccountFormData>({
        name: initialData?.name ?? "",
        description: initialData?.description ?? "",
        type: initialData?.type ?? AccountType.DEPOSITORY,
        initial_balance: initialData?.initial_balance ?? "0.00",
        currency_code: initialData?.currency_code ?? "USD",
    });
}
