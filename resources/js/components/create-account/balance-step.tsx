"use client";

import { getInputProps, type useForm, useInputControl } from "@conform-to/react";
import { resolveCurrencyFormat } from "@sumup/intl";
import { type NumberFormat } from "@sumup/intl/dist/es/types/index";
import { format } from "date-fns";
import Decimal from "decimal.js";
import { CurrencyInput } from "headless-currency-input";
import * as React from "react";
import { type NumberFormatValues } from "react-number-format";
import type * as v from "valibot";

import { useTranslation } from "#/hooks/use-translation.ts";
import { InterestRateTypeEnum, type BalanceSchema } from "#/utils/steppers/create-account.step.ts";
import { SelectField } from "../form/select-field.tsx";
import { TextField } from "../form/text-field.tsx";
import * as Button from "../ui/button.tsx";
import * as DatepickerPrimivites from "../ui/datepicker.tsx";
import * as Divider from "../ui/divider.tsx";
import * as Hint from "../ui/hint.tsx";
import * as InputPrimitives from "../ui/input.tsx";
import * as Label from "../ui/label.tsx";
import * as Popover from "../ui/popover.tsx";
import * as Select from "../ui/select.tsx";

type DetailsStepProps = {
    currencies: Array<string>;
    fields: ReturnType<typeof useForm<v.InferOutput<typeof BalanceSchema>>>[1];
};

export function BalanceStep({ currencies, fields }: DetailsStepProps) {
    const { language } = useTranslation();
    const currencyCodeControl = useInputControl(fields.currency_code);
    const currencyFormat = resolveCurrencyFormat(language, currencyCodeControl.value || "USD");
    const initialBalanceControl = useInputControl(fields.initial_balance);

    function handleMoneyChange(value: NumberFormatValues) {
        const decimalValue = new Decimal(value.value).toDecimalPlaces(currencyFormat?.minimumFractionDigits);

        return decimalValue.toFixed(currencyFormat?.minimumFractionDigits);
    }

    return (
        <>
            <input {...getInputProps(fields.initial_balance, { type: "hidden" })} />
            <input {...getInputProps(fields.type, { type: "hidden" })} />
            <input {...getInputProps(fields.currency_code, { type: "hidden" })} />

            <CurrencyInput
                currency={currencyFormat?.currency || "USD"}
                customInput={TextField}
                error={fields.initial_balance.errors}
                inlineLeadingNode={
                    <InputPrimitives.InlineAffix>{currencyFormat?.currencySymbol}</InputPrimitives.InlineAffix>
                }
                label="Initial balance"
                name="initial_balance"
                onValueChange={handleMoneyChange}
                placeholder="e.g. 1.00"
                trailingNode={
                    <SelectCurrencies
                        currencies={currencies}
                        onValueChange={currencyCodeControl.change}
                        value={currencyCodeControl.value}
                    />
                }
                value={initialBalanceControl.value}
                withCurrencySymbol={false}
            />

            {(fields.type.value === "credit_card" || fields.type.value === "loan") && <Divider.Root />}

            {fields.type.value === "credit_card" && (
                <CreditCardFields
                    currencyFormat={currencyFormat}
                    fields={fields}
                    handleMoneyChange={handleMoneyChange}
                />
            )}

            {fields.type.value === "loan" && <LoanFields fields={fields} />}
        </>
    );
}

type SelectCurrenciesProps = React.CustomComponentPropsWithRef<typeof Select.Root> & {
    currencies: Array<string>;
};

function SelectCurrencies({ currencies, ...rest }: SelectCurrenciesProps) {
    const items = React.useMemo(() => currencies, [currencies]);

    return (
        <Select.Root $variant="compactForInput" defaultValue="USD" {...rest}>
            <Select.Trigger>
                <Select.Value>
                    <span className="flex flex-1 items-center gap-2">
                        <svg
                            aria-label={`${rest.value || "USD"} flag`}
                            className="size-5 rounded-full"
                            preserveAspectRatio="xMidYMid meet"
                            role="img"
                        >
                            <use href={`/img/flags.svg#${rest.value || "USD"}`} />
                        </svg>
                        <span>{rest.value || "USD"}</span>
                    </span>
                </Select.Value>
            </Select.Trigger>
            <Select.Content>
                {items.map((item) => (
                    <Select.Item key={item} value={item}>
                        <Select.ItemIcon
                            aria-label={`${item} flag`}
                            as="svg"
                            className="size-5 rounded-full"
                            preserveAspectRatio="xMidYMid meet"
                            role="img"
                        >
                            <use href={`/img/flags.svg#${item}`} />
                        </Select.ItemIcon>
                        {item}
                    </Select.Item>
                ))}
            </Select.Content>
        </Select.Root>
    );
}

type CreditCardFieldsProps = {
    fields: ReturnType<typeof useForm<v.InferOutput<typeof BalanceSchema>>>[1];
    currencyFormat: NumberFormat | null;
    handleMoneyChange(value: NumberFormatValues): string;
};

function CreditCardFields({ fields, currencyFormat, handleMoneyChange }: CreditCardFieldsProps) {
    const availableBalanceControl = useInputControl(fields.available_balance);
    const minimumPaymentControl = useInputControl(fields.minimum_payment);
    const expiresAtControl = useInputControl(fields.expires_at);
    const annualFeeControl = useInputControl(fields.annual_fee);
    const { t } = useTranslation();

    return (
        <>
            <input {...getInputProps(fields.available_balance, { type: "hidden" })} />
            <input {...getInputProps(fields.minimum_payment, { type: "hidden" })} />
            <input {...getInputProps(fields.expires_at, { type: "hidden" })} />
            <input {...getInputProps(fields.annual_fee, { type: "hidden" })} />

            <CurrencyInput
                currency={currencyFormat?.currency || "USD"}
                customInput={TextField}
                error={fields.available_balance.errors}
                inlineLeadingNode={
                    <InputPrimitives.InlineAffix>{currencyFormat?.currencySymbol}</InputPrimitives.InlineAffix>
                }
                label={t("form.fields.available_balance.label")}
                name="available_balance"
                onValueChange={(values) => availableBalanceControl.change(handleMoneyChange(values))}
                placeholder={t("form.fields.available_balance.placeholder")}
                value={availableBalanceControl.value}
                withCurrencySymbol={false}
            />

            <div className="grid grid-cols-2 gap-4">
                <CurrencyInput
                    currency={currencyFormat?.currency || "USD"}
                    customInput={TextField}
                    error={fields.minimum_payment.errors}
                    inlineLeadingNode={
                        <InputPrimitives.InlineAffix>{currencyFormat?.currencySymbol}</InputPrimitives.InlineAffix>
                    }
                    label={t("form.fields.minimum_payment.label")}
                    name="minimum_payment"
                    onValueChange={(values) => minimumPaymentControl.change(handleMoneyChange(values))}
                    placeholder={t("form.fields.minimum_payment.placeholder")}
                    value={minimumPaymentControl.value}
                    withCurrencySymbol={false}
                />

                <TextField
                    error={fields.apr.errors}
                    inlineTrailingNode={<InputPrimitives.InlineAffix>%</InputPrimitives.InlineAffix>}
                    label={t("form.fields.apr.label")}
                    placeholder={t("form.fields.apr.placeholder")}
                    {...getInputProps(fields.apr, {
                        type: "number",
                    })}
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                    <Label.Root htmlFor={fields.expires_at.id}>{t("form.fields.expires_at.label")}</Label.Root>

                    <Popover.Root>
                        <Popover.Trigger asChild>
                            <Button.Root $style="stroke" $type="neutral" id={fields.expires_at.id}>
                                {expiresAtControl.value
                                    ? format(expiresAtControl.value, "LLL dd, y")
                                    : t("form.fields.expires_at.placeholder")}
                            </Button.Root>
                        </Popover.Trigger>
                        <Popover.Content className="p-0" showArrow={false}>
                            <DatepickerPrimivites.Calendar
                                mode="single"
                                onSelect={(date) => {
                                    expiresAtControl.change(date?.toISOString());
                                }}
                                selected={expiresAtControl.value ? new Date(expiresAtControl.value) : undefined}
                            />
                            <div className="flex items-center justify-between gap-4 border-t border-(--stroke-soft-200) p-4 py-5">
                                <Popover.Close asChild unstyled>
                                    <Button.Root
                                        $size="sm"
                                        $style="stroke"
                                        $type="neutral"
                                        className="w-full"
                                        //onClick={handleCancel}
                                    >
                                        {t("common.cancel")}
                                    </Button.Root>
                                </Popover.Close>
                                <Popover.Close asChild unstyled>
                                    <Button.Root
                                        $size="sm"
                                        $style="filled"
                                        $type="primary"
                                        className="w-full"
                                        //onClick={handleApply}
                                    >
                                        {t("common.apply")}
                                    </Button.Root>
                                </Popover.Close>
                            </div>
                        </Popover.Content>
                    </Popover.Root>

                    {fields.expires_at.errors ? (
                        <Hint.Root $error aria-describedby={`${fields.expires_at.id}-error`}>
                            <Hint.Icon />
                            {fields.expires_at.errors}
                        </Hint.Root>
                    ) : null}
                </div>

                <CurrencyInput
                    currency={currencyFormat?.currency || "USD"}
                    customInput={TextField}
                    error={fields.annual_fee.errors}
                    inlineLeadingNode={
                        <InputPrimitives.InlineAffix>{currencyFormat?.currencySymbol}</InputPrimitives.InlineAffix>
                    }
                    label={t("form.fields.annual_fee.label")}
                    name="annual_fee"
                    onValueChange={(values) => annualFeeControl.change(handleMoneyChange(values))}
                    placeholder={t("form.fields.annual_fee.placeholder")}
                    value={annualFeeControl.value}
                    withCurrencySymbol={false}
                />
            </div>
        </>
    );
}

type LoanFieldsProps = {
    fields: ReturnType<typeof useForm<v.InferOutput<typeof BalanceSchema>>>[1];
};

function LoanFields({ fields }: LoanFieldsProps) {
    const interestRateTypeControl = useInputControl(fields.interest_rate_type);
    const { t } = useTranslation();

    return (
        <>
            <input {...getInputProps(fields.interest_rate, { type: "hidden" })} />

            <div className="grid grid-cols-2 gap-4">
                <TextField
                    error={fields.interest_rate.errors}
                    inlineTrailingNode={<InputPrimitives.InlineAffix>%</InputPrimitives.InlineAffix>}
                    label={t("form.fields.interest_rate.label")}
                    placeholder={t("form.fields.interest_rate.placeholder")}
                    {...getInputProps(fields.interest_rate, {
                        type: "number",
                    })}
                />

                <SelectField
                    defaultValue={fields.interest_rate_type.initialValue}
                    error={fields.interest_rate_type.errors}
                    id={fields.interest_rate_type.id}
                    label={t("form.fields.interest_rate_type.label")}
                    name={fields.interest_rate_type.name}
                    onValueChange={interestRateTypeControl.change}
                    options={InterestRateTypeEnum.options.map((option) => ({
                        label: option,
                        value: option,
                    }))}
                    placeholder={t("form.fields.interest_rate_type.placeholder")}
                    position="item-aligned"
                    value={interestRateTypeControl.value}
                />
            </div>

            <TextField
                error={fields.term_months.errors}
                label={t("form.fields.term_months.label")}
                placeholder={t("form.fields.term_months.placeholder")}
                {...getInputProps(fields.term_months, {
                    type: "number",
                })}
            />
        </>
    );
}
