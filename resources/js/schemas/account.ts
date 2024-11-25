import { z } from "zod";

import { zodDecimal } from "#/utils/zod-decimal.ts";

export const accountTypeEnum = z.enum([
    "depository",
    "investment",
    "crypto",
    "credit_card",
    "loan",
    "other_asset",
    "other_liability",
]);

export const depositorySubtypeEnum = z.enum(["checking", "savings"]);
export const investmentSubtypeEnum = z.enum([
    "brokerage",
    "pension",
    "retirement",
    "401k",
    "traditional_401k",
    "roth_401k",
    "529_plan",
    "hsa",
    "mutual_fund",
    "traditional_ira",
    "roth_ira",
    "angel",
]);

export const accountSubtypeEnum = z.union([depositorySubtypeEnum, investmentSubtypeEnum]);

export const accountSchema = z.object({
    id: z.number(),
    name: z.string(),
    description: z.string().optional().nullable(),
    subtype: accountSubtypeEnum.optional().nullable(),
    currency_code: z.string(),
    initial_balance: zodDecimal({
        required_error: "Initial balance is required",
    })
        .wholeNumber(19)
        .precision(4),
    current_balance: zodDecimal({
        required_error: "Current balance is required",
    })
        .wholeNumber(19)
        .precision(4),
    is_default: z.boolean().default(false),
    public_id: z.string(),
    workspace_id: z.number(),
    created_by: z.number(),
    updated_by: z.number(),
    created_at: z.string().datetime(),
    updated_at: z.string().datetime(),
});
