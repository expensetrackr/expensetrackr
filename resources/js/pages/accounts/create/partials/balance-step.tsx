import { getInputProps, type useForm, useInputControl } from "@conform-to/react";
import { resolveCurrencyFormat } from "@sumup/intl";
import { type NumberFormat } from "@sumup/intl/dist/es/types/index";
import { format } from "date-fns";
import Decimal from "decimal.js";
import { CurrencyInput } from "headless-currency-input";
import * as React from "react";
import { type NumberFormatValues } from "react-number-format";

import { Select as SelectComponent } from "#/components/form/select.tsx";
import { TextField } from "#/components/form/text-field.tsx";
import * as Button from "#/components/ui/button.tsx";
import * as DatepickerPrimivites from "#/components/ui/datepicker.tsx";
import * as Divider from "#/components/ui/divider.tsx";
import * as Hint from "#/components/ui/hint.tsx";
import * as InputPrimitives from "#/components/ui/input.tsx";
import * as Label from "#/components/ui/label.tsx";
import * as Popover from "#/components/ui/popover.tsx";
import * as Select from "#/components/ui/select.tsx";
import { useTranslation } from "#/hooks/use-translation.ts";
import { useCreateAccountWizardStore } from "#/store/create-account-wizard.ts";
import { interestRateTypeEnum, type BalanceStepValues } from "./stepper.ts";

type DetailsStepProps = {
    currencies: Array<string>;
    fields: ReturnType<typeof useForm<BalanceStepValues>>[1];
};

export function BalanceStep({ currencies, fields }: DetailsStepProps) {
    const { type } = useCreateAccountWizardStore();
    const currencyCodeControl = useInputControl(fields.currency_code);
    const currencyFormat = resolveCurrencyFormat("en", currencyCodeControl.value || "USD");
    const initialBalanceControl = useInputControl(fields.initial_balance);

    function handleMoneyChange(value: NumberFormatValues) {
        const decimalValue = new Decimal(value.value).toDecimalPlaces(currencyFormat?.minimumFractionDigits);
        initialBalanceControl.change(decimalValue.toFixed(currencyFormat?.minimumFractionDigits));
    }

    return (
        <>
            <input {...getInputProps(fields.type, { type: "hidden", value: false })} value={type || ""} />

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

            {(type === "credit_card" || type === "loan") && <Divider.Root />}

            {type === "credit_card" && (
                <CreditCardFields
                    currencyFormat={currencyFormat}
                    fields={fields}
                    handleMoneyChange={handleMoneyChange}
                />
            )}

            {type === "loan" && <LoanFields fields={fields} />}
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
    fields: ReturnType<typeof useForm<BalanceStepValues>>[1];
    currencyFormat: NumberFormat | null;
    handleMoneyChange(value: NumberFormatValues): void;
};

function CreditCardFields({ fields, currencyFormat, handleMoneyChange }: CreditCardFieldsProps) {
    const availableBalanceControl = useInputControl(fields.available_balance);
    const minimumPaymentControl = useInputControl(fields.minimum_payment);
    const expiresAtControl = useInputControl(fields.expires_at);
    const { t } = useTranslation();

    return (
        <>
            <CurrencyInput
                currency={currencyFormat?.currency || "USD"}
                customInput={TextField}
                error={fields.available_balance.errors}
                inlineLeadingNode={
                    <InputPrimitives.InlineAffix>{currencyFormat?.currencySymbol}</InputPrimitives.InlineAffix>
                }
                label={t("form.fields.available_balance.label")}
                name="available_balance"
                onValueChange={handleMoneyChange}
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
                    onValueChange={handleMoneyChange}
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
        </>
    );
}

type LoanFieldsProps = {
    fields: ReturnType<typeof useForm<BalanceStepValues>>[1];
};

function LoanFields({ fields }: LoanFieldsProps) {
    const interestRateTypeControl = useInputControl(fields.interest_rate_type);
    const { t } = useTranslation();

    return (
        <>
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

                <SelectComponent
                    defaultValue={fields.interest_rate_type.initialValue}
                    error={fields.interest_rate_type.errors}
                    id={fields.interest_rate_type.id}
                    label={t("form.fields.interest_rate_type.label")}
                    name={fields.interest_rate_type.name}
                    onValueChange={interestRateTypeControl.change}
                    options={interestRateTypeEnum.options.map((option) => ({
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
