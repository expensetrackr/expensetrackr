import * as v from "valibot";

export const ProviderType = {
    Teller: "teller",
    Mx: "mx",
} as const;

export const BankConnectionProviderSchema = v.enum(ProviderType);
