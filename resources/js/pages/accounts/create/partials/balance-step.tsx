import { type useForm, useInputControl } from "@conform-to/react";
import { resolveCurrencyFormat } from "@sumup/intl";
import Decimal from "decimal.js";
import { type NumberFormatValues } from "react-number-format";

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

    function handleBalanceChange(value: NumberFormatValues) {
        const decimalValue = new Decimal(value.value).toDecimalPlaces(currencyFormat?.minimumFractionDigits);
        initialBalanceControl.change(decimalValue.toFixed(currencyFormat?.minimumFractionDigits));
    }

    return (
        <>
            {/* <InputGroup>
                <MoneyDollarCircleFillIcon />
                <CurrencyInput
                    currency={fields.currency_code.value || "USD"}
                    customInput={Input}
                    invalid={!!fields.initial_balance.errors}
                    locale="en"
                    name="initial_balance"
                    onValueChange={handleBalanceChange}
                    placeholder="e.g. 1000"
                    value={initialBalanceControl.value}
                />
            </InputGroup>
            <Field>
                <Label>Initial balance</Label>
                {fields.initial_balance.errors && <Hint invalid>{fields.initial_balance.errors}</Hint>}
            </Field>

            <CurrencySelector
                currencies={currencies}
                error={fields.currency_code.errors?.join(", ")}
                onChange={currencyCodeControl.change}
                value={currencyCodeControl.value || "USD"}
            /> */}
        </>
    );
}
