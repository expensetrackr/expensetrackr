import { getInputProps, type useForm, useInputControl } from "@conform-to/react";
import { resolveCurrencyFormat } from "@sumup/intl";
import Decimal from "decimal.js";
import { CurrencyInput } from "headless-currency-input";
import * as React from "react";
import { type NumberFormatValues } from "react-number-format";

import { TextField } from "#/components/text-field.tsx";
import * as Divider from "#/components/ui/divider.tsx";
import * as InputPrimitives from "#/components/ui/input.tsx";
import * as Select from "#/components/ui/select.tsx";
import { useCreateAccountWizardStore } from "#/store/create-account-wizard.ts";
import { type BalanceStepValues } from "./stepper.ts";

type DetailsStepProps = {
    currencies: Array<string>;
    fields: ReturnType<typeof useForm<BalanceStepValues>>[1];
};

export function BalanceStep({ currencies, fields }: DetailsStepProps) {
    const { type } = useCreateAccountWizardStore();
    const currencyCodeControl = useInputControl(fields.currency_code);
    const currencyFormat = resolveCurrencyFormat("en", currencyCodeControl.value || "USD");
    const initialBalanceControl = useInputControl(fields.initial_balance);
    const availableBalanceControl = useInputControl(fields.available_balance);
    const minimumPaymentControl = useInputControl(fields.minimum_payment);

    function handleMoneyChange(value: NumberFormatValues) {
        const decimalValue = new Decimal(value.value).toDecimalPlaces(currencyFormat?.minimumFractionDigits);
        initialBalanceControl.change(decimalValue.toFixed(currencyFormat?.minimumFractionDigits));
    }

    return (
        <>
            <input {...getInputProps(fields.type, { type: "hidden" })} value={type || ""} />

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

            <Divider.Root />

            <CurrencyInput
                currency={currencyFormat?.currency || "USD"}
                customInput={TextField}
                error={fields.available_balance.errors}
                inlineLeadingNode={
                    <InputPrimitives.InlineAffix>{currencyFormat?.currencySymbol}</InputPrimitives.InlineAffix>
                }
                label="Available credit"
                name="available_balance"
                onValueChange={handleMoneyChange}
                placeholder="e.g. 1.00"
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
                    label="Minimum payment"
                    name="minimum_payment"
                    onValueChange={handleMoneyChange}
                    placeholder="e.g. 1.00"
                    value={minimumPaymentControl.value}
                    withCurrencySymbol={false}
                />

                <TextField
                    error={fields.apr.errors}
                    inlineTrailingNode={<InputPrimitives.InlineAffix>%</InputPrimitives.InlineAffix>}
                    label="APR"
                    placeholder="10"
                    {...getInputProps(fields.apr, {
                        type: "number",
                    })}
                />
            </div>
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
