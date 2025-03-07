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

export const AccountSchema = v.object({
    id: v.number(),
    name: v.string(),
    description: v.nullable(v.string()),
    subtype: v.optional(v.nullable(AccountSubtypeEnum)),
    currency_code: v.string(),
    initial_balance: v.pipe(v.string(), v.decimal("The decimal is badly formatted.")),
    current_balance: v.pipe(v.string(), v.decimal("The decimal is badly formatted.")),
    is_default: v.boolean(),
    public_id: v.string(),
    workspace_id: v.number(),
    created_by: v.number(),
    updated_by: v.number(),
    created_at: v.string(),
    updated_at: v.string(),
});
