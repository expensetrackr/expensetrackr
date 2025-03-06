import { defineStepper } from "@stepperize/react";
import { z } from "zod";

import { accountSchema, accountTypeEnum } from "#/schemas/account.ts";
import { bankAccountProvider } from "#/schemas/bank-account.ts";
import { zodDecimal } from "../zod-decimal.ts";

export const detailsSchema = accountSchema.pick({ name: true, description: true, subtype: true }).merge(
    z.object({
        type: accountTypeEnum,
    }),
);

export const creditCardDetailsSchema = z.object({
    available_balance: zodDecimal().wholeNumber(10),
    minimum_payment: zodDecimal().wholeNumber(10),
    apr: zodDecimal().wholeNumber(10),
    annual_fee: zodDecimal().wholeNumber(10),
    expires_at: z.string().datetime(),
});

export const interestRateTypeEnum = z.enum(["fixed", "variable", "adjustable"]);
export const loanDetailsSchema = z.object({
    interest_rate: zodDecimal().wholeNumber(10),
    interest_rate_type: interestRateTypeEnum,
    term_months: z.number().min(1),
});

export const baseBalanceSchema = accountSchema.pick({
    initial_balance: true,
    current_balance: true,
    currency_code: true,
});

export const balanceSchema = z.discriminatedUnion("type", [
    baseBalanceSchema.extend({
        type: z.literal(accountTypeEnum.Enum.depository),
    }),
    baseBalanceSchema.extend({
        type: z.literal(accountTypeEnum.Enum.investment),
    }),
    baseBalanceSchema.extend({
        type: z.literal(accountTypeEnum.Enum.credit_card),
        ...creditCardDetailsSchema.shape,
    }),
    baseBalanceSchema.extend({
        type: z.literal(accountTypeEnum.Enum.loan),
        ...loanDetailsSchema.shape,
    }),
]);

export const createAccountSchema = balanceSchema.and(detailsSchema);

export const connectAccountsSchema = z.object({
    provider_connection_id: z.string().nullish(),
    provider_type: bankAccountProvider,
    access_token: z.string(),
    accounts: z.array(
        z.object({
            institution_id: z.string(),
            institution_logo_url: z.string().nullish(),
            institution_name: z.string(),
            name: z.string(),
            account_id: z.string(),
            currency: z.string(),
            balance: zodDecimal().wholeNumber(10),
            enabled: z.boolean(),
            type: accountTypeEnum,
            token_expires_at: z.string().datetime().nullish(),
        }),
    ),
});

export const createAccount = defineStepper(
    { id: "type", label: "Type" },
    { id: "connection_type", label: "Connection" },
);

export const createManualAccount = defineStepper(
    { id: "details", label: "Details", schema: detailsSchema },
    { id: "balance", label: "Balance & Currency", schema: balanceSchema },
    { id: "complete", label: "Account Summary", schema: createAccountSchema },
);

export const ConnectAccountStepper = defineStepper(
    { id: "institution-selection", label: "Institution selection" },
    { id: "bank-accounts-selection", label: "Bank accounts selection", schema: connectAccountsSchema },
);

export type DetailsStepValues = z.infer<typeof detailsSchema>;
export type BalanceStepValues = z.infer<typeof balanceSchema>;
