import { getInputProps, type useForm } from "@conform-to/react";
import type * as v from "valibot";

import { useTranslation } from "#/hooks/use-translation.ts";
import { SubtypeOptions } from "#/schemas/account.ts";
import { formatDate } from "#/utils/date-formatter.ts";
import { currencyFormatter } from "#/utils/number-formatter.ts";
import { type CreateAccountSchema } from "#/utils/steppers/create-account.step.ts";
import * as Avatar from "../ui/avatar.tsx";
import * as Divider from "../ui/divider.tsx";

type AccountSummaryStepProps = {
    fields: ReturnType<typeof useForm<v.InferOutput<typeof CreateAccountSchema>>>[1];
};

export function AccountSummaryStep({ fields }: AccountSummaryStepProps) {
    const { language } = useTranslation();

    return (
        <>
            <input {...getInputProps(fields.name, { type: "hidden" })} />
            <input {...getInputProps(fields.description, { type: "hidden" })} />
            <input {...getInputProps(fields.type, { type: "hidden" })} />
            <input {...getInputProps(fields.currency_code, { type: "hidden" })} />
            <input {...getInputProps(fields.initial_balance, { type: "hidden" })} />

            {SubtypeOptions[fields.type.value as keyof typeof SubtypeOptions] && (
                <input {...getInputProps(fields.subtype, { type: "hidden" })} />
            )}

            {/* Credit card details */}
            {fields.type.value === "credit_card" && (
                <>
                    <input {...getInputProps(fields.available_balance, { type: "hidden" })} />
                    <input {...getInputProps(fields.minimum_payment, { type: "hidden" })} />
                    <input {...getInputProps(fields.apr, { type: "hidden" })} />
                    <input {...getInputProps(fields.annual_fee, { type: "hidden" })} />
                    <input {...getInputProps(fields.expires_at, { type: "hidden" })} />
                </>
            )}

            {/* Loan details */}
            {fields.type.value === "loan" && (
                <>
                    <input {...getInputProps(fields.interest_rate, { type: "hidden" })} />
                    <input {...getInputProps(fields.interest_rate_type, { type: "hidden" })} />
                    <input {...getInputProps(fields.term_months, { type: "hidden" })} />
                </>
            )}

            <div className="flex items-center gap-3.5 px-5 pt-4">
                <Avatar.Root $size="40">
                    {fields.name.value
                        ?.split(" ")
                        .map((word) => word.charAt(0))
                        .join("")}
                </Avatar.Root>

                <div className="flex flex-col gap-1">
                    <div className="text-label-sm">{fields.name.value}</div>
                    <div className="text-paragraph-xs text-(--text-sub-600)">{fields.type.value}</div>
                </div>
            </div>

            <div className="px-px">
                <Divider.Root $type="solid-text">Account details</Divider.Root>

                <div className="flex flex-col gap-2 p-4">
                    <div className="flex items-center justify-between gap-3">
                        <div className="text-paragraph-sm text-(--text-sub-600)">Type</div>
                        <div className="text-right text-label-sm">{fields.type.value}</div>
                    </div>
                    {fields.subtype.value && (
                        <div className="flex items-center justify-between gap-3">
                            <div className="text-paragraph-sm text-(--text-sub-600)">Subtype</div>
                            <div className="text-right text-label-sm">{fields.subtype.value}</div>
                        </div>
                    )}
                </div>

                <Divider.Root $type="solid-text">Balance details</Divider.Root>

                <div className="flex flex-col gap-2 p-4">
                    {fields.initial_balance.value && (
                        <div className="flex items-center justify-between gap-3">
                            <div className="text-paragraph-sm text-(--text-sub-600)">Balance</div>
                            <div className="text-right text-label-sm">
                                {currencyFormatter({
                                    amount: fields.initial_balance.value,
                                    currency: fields.currency_code.value,
                                    locale: language,
                                })}
                            </div>
                        </div>
                    )}
                    <div className="flex items-center justify-between gap-3">
                        <div className="text-paragraph-sm text-(--text-sub-600)">Currency</div>
                        <div className="text-right text-label-sm">{fields.currency_code.value}</div>
                    </div>
                </div>

                {fields.type.value === "credit_card" && (
                    <>
                        <Divider.Root $type="solid-text">Credit card details</Divider.Root>

                        <div className="flex flex-col gap-2 p-4">
                            <div className="flex items-center justify-between gap-3">
                                <div className="text-paragraph-sm text-(--text-sub-600)">Available balance</div>
                                <div className="text-right text-label-sm">
                                    {fields.available_balance.value
                                        ? currencyFormatter({
                                              amount: fields.available_balance.value.replace(/,/g, ""),
                                              currency: fields.currency_code.value,
                                              locale: language,
                                          })
                                        : "N/A"}
                                </div>
                            </div>
                            <div className="flex items-center justify-between gap-3">
                                <div className="text-paragraph-sm text-(--text-sub-600)">Minimum payment</div>
                                <div className="text-right text-label-sm">
                                    {fields.minimum_payment.value
                                        ? currencyFormatter({
                                              amount: fields.minimum_payment.value,
                                              currency: fields.currency_code.value,
                                              locale: language,
                                          })
                                        : "N/A"}
                                </div>
                            </div>
                            <div className="flex items-center justify-between gap-3">
                                <div className="text-paragraph-sm text-(--text-sub-600)">APR</div>
                                <div className="text-right text-label-sm">
                                    {fields.apr.value ? `${fields.apr.value}%` : "N/A"}
                                </div>
                            </div>
                            <div className="flex items-center justify-between gap-3">
                                <div className="text-paragraph-sm text-(--text-sub-600)">Annual fee</div>
                                <div className="text-right text-label-sm">
                                    {fields.annual_fee.value
                                        ? currencyFormatter({
                                              amount: fields.annual_fee.value,
                                              currency: fields.currency_code.value,
                                              locale: language,
                                          })
                                        : "N/A"}
                                </div>
                            </div>
                            <div className="flex items-center justify-between gap-3">
                                <div className="text-paragraph-sm text-(--text-sub-600)">Expires at</div>
                                <div className="text-right text-label-sm">
                                    {fields.expires_at.value ? formatDate(fields.expires_at.value) : "N/A"}
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {fields.type.value === "loan" && (
                    <>
                        <Divider.Root $type="solid-text">Loan details</Divider.Root>

                        <div className="flex flex-col gap-2 p-4">
                            <div className="flex items-center justify-between gap-3">
                                <div className="text-paragraph-sm text-(--text-sub-600)">Interest rate</div>
                                <div className="text-right text-label-sm">
                                    {fields.interest_rate.value
                                        ? currencyFormatter({
                                              amount: fields.interest_rate.value,
                                              currency: fields.currency_code.value,
                                              locale: language,
                                          })
                                        : "N/A"}
                                </div>
                            </div>
                            <div className="flex items-center justify-between gap-3">
                                <div className="text-paragraph-sm text-(--text-sub-600)">Interest rate type</div>
                                <div className="text-right text-label-sm">{fields.interest_rate_type.value}</div>
                            </div>
                            <div className="flex items-center justify-between gap-3">
                                <div className="text-paragraph-sm text-(--text-sub-600)">Term months</div>
                                <div className="text-right text-label-sm">{fields.term_months.value}</div>
                            </div>
                        </div>
                    </>
                )}

                {fields.description.value && (
                    <>
                        <Divider.Root $type="solid-text">Additional details</Divider.Root>

                        <div className="flex flex-col gap-2 p-4">
                            <div className="text-paragraph-sm text-(--text-sub-600)">Description</div>
                            <div className="text-right text-label-sm">{fields.description.value}</div>
                        </div>
                    </>
                )}
            </div>
        </>
    );
}
