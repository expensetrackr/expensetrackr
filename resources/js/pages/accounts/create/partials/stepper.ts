import { defineStepper } from "@stepperize/react";
import { z } from "zod";

import { accountSchema, accountTypeEnum } from "#/schemas/account.ts";
import { zodDecimal } from "#/utils/zod-decimal.ts";

export const typeStepSchema = z.object({
    type: accountTypeEnum,
});
export const detailsSchema = accountSchema.pick({ name: true, description: true, subtype: true });

export const creditCardDetailsSchema = z.object({
    available_balance: zodDecimal().wholeNumber(10),
    minimum_payment: zodDecimal().wholeNumber(10),
    apr: zodDecimal().wholeNumber(10),
    annual_fee: zodDecimal().wholeNumber(10),
    expires_at: z.string().datetime(),
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
]);

export type DetailsStepValues = z.infer<typeof detailsSchema>;

export const { useStepper, Scoped } = defineStepper(
    { id: "type", label: "Type selection", schema: typeStepSchema },
    { id: "details", label: "Details", schema: detailsSchema },
    { id: "balance", label: "Balance & Currency", schema: balanceSchema },
    { id: "complete", label: "Account Summary", schema: typeStepSchema },
);
