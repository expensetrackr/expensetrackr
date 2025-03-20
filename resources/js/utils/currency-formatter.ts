import { type Format } from "@number-flow/react";
import { resolveCurrencyFormat } from "@sumup/intl";
import Decimal from "decimal.js";

type DecimalFormatterOptions = {
    amount: Decimal.Value;
    currency?: string;
    language?: string;
};

export function decimalFlowFormatter({ amount, currency = "USD", language = "en" }: DecimalFormatterOptions) {
    const formatter = resolveCurrencyFormat(language, currency);
    const value = new Decimal(amount).toDecimalPlaces(formatter?.minimumFractionDigits).toNumber();
    const format: Format = {
        style: "currency",
        currency,
        minimumFractionDigits: formatter?.minimumFractionDigits,
        maximumFractionDigits: formatter?.maximumFractionDigits,
    };

    return {
        format,
        value,
    };
}
