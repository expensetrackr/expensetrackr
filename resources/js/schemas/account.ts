import * as v from "valibot";

import { AccountSubtype, AccountType, DepositorySubtype, InvestmentSubtype } from "#/models/account.ts";

const ConnectionType = {
    Connect: "connect",
    Manual: "manual",
} as const;

export const AccountTypeEnum = v.enum(AccountType);
export const DepositorySubtypeEnum = v.enum(DepositorySubtype);
export const InvestmentSubtypeEnum = v.enum(InvestmentSubtype);
export const AccountSubtypeEnum = v.enum(AccountSubtype);
export const ConnectionTypeEnum = v.enum(ConnectionType);

export const SubtypeOptions = {
    [AccountTypeEnum.enum.Depository]: DepositorySubtypeEnum.options,
    [AccountTypeEnum.enum.Investment]: InvestmentSubtypeEnum.options,
};

export const AccountSchema = v.object({
    id: v.number(),
    name: v.string(),
    description: v.optional(v.nullable(v.string())),
    subtype: v.optional(v.nullable(AccountSubtypeEnum)),
    currency_code: v.string(),
    base_currency: v.optional(v.nullable(v.string())),
    currency_rate: v.optional(v.nullable(v.string())),
    // TODO: properly validate decimals
    initial_balance: v.string(),
    base_initial_balance: v.optional(v.nullable(v.string())),
    current_balance: v.string(),
    base_current_balance: v.optional(v.nullable(v.string())),
    is_default: v.boolean(),
    public_id: v.string(),
    workspace_id: v.number(),
    created_by: v.number(),
    updated_by: v.number(),
    created_at: v.string(),
    updated_at: v.string(),
});
