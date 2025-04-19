import { defineStepper } from "@stepperize/react";
import * as v from "valibot";

import { AccountSchema, AccountTypeEnum } from "#/schemas/account.ts";

export const DetailsSchema = v.object({
    ...v.pick(AccountSchema, ["name", "description", "subtype"]).entries,
    type: AccountTypeEnum,
});

export const CreditCardDetailsSchema = v.object({
    available_balance: v.string(),
    minimum_payment: v.string(),
    apr: v.pipe(
        v.number("You must provide an APR."),
        v.minValue(0, "The APR must be greater than 0%."),
        v.maxValue(100, "The APR must be less than 100%."),
    ),
    annual_fee: v.string(),
    expires_at: v.pipe(
        v.string("You must provide an expiration date."),
        v.minLength(10, "The expiration date is invalid."),
    ),
});

const InterestRateType = {
    Fixed: "fixed",
    Variable: "variable",
    Adjustable: "adjustable",
} as const;
export const InterestRateTypeEnum = v.enum(InterestRateType);

export const LoanDetailsSchema = v.object({
    interest_rate: v.pipe(v.string(), v.decimal("The decimal is badly formatted.")),
    interest_rate_type: InterestRateTypeEnum,
    term_months: v.pipe(v.number(), v.minValue(1)),
});

export const BaseBalanceSchema = v.pick(AccountSchema, ["initial_balance", "currency_code"]);

export const BalanceSchema = v.variant("type", [
    v.object({
        type: v.literal(AccountTypeEnum.enum.Depository),
        ...BaseBalanceSchema.entries,
    }),
    v.object({
        type: v.literal(AccountTypeEnum.enum.Investment),
        ...BaseBalanceSchema.entries,
    }),
    v.object({
        type: v.literal(AccountTypeEnum.enum.CreditCard),
        ...BaseBalanceSchema.entries,
        ...CreditCardDetailsSchema.entries,
    }),
    v.object({
        type: v.literal(AccountTypeEnum.enum.Loan),
        ...BaseBalanceSchema.entries,
        ...LoanDetailsSchema.entries,
    }),
]);

export const CreateAccountSchema = v.intersect([DetailsSchema, BalanceSchema]);

export const CreateAccountStepper = defineStepper(
    { id: "type", label: "Type" },
    { id: "connection_type", label: "Connection" },
);

export const CreateManualAccountStepper = defineStepper(
    { id: "details", label: "Details", schema: DetailsSchema },
    { id: "balance", label: "Balance & Currency", schema: BalanceSchema },
    { id: "summary", label: "Account Summary", schema: CreateAccountSchema },
);

export const ConnectAccountStepper = defineStepper(
    { id: "institution-selection", label: "Institution selection" },
    { id: "bank-accounts-selection", label: "Bank accounts selection" },
);
