import { resolveCurrencyFormat } from "@sumup/intl";
import { type Currency, type Locale } from "@sumup/intl/dist/es/types";
import Decimal from "decimal.js";

type CurrencyFormatterOptions = {
    locale?: Locale | Array<Locale>;
    currency?: Currency;
    options?: Intl.NumberFormatOptions;
    amount: Decimal.Value;
};

export function currencyFormatter(opts?: CurrencyFormatterOptions | null) {
    const { locale = "en", currency = "USD", options, amount } = opts || {};
    const format = resolveCurrencyFormat(locale, currency);
    const value = new Decimal(amount ?? 0).toDecimalPlaces(format?.minimumFractionDigits).toNumber();

    if (!format) {
        throw new Error("Currency format not found");
    }

    return new Intl.NumberFormat(locale, {
        ...format,
        ...options,
    }).format(value);
}

export const compactNumFormatter = new Intl.NumberFormat("en-US", {
    notation: "compact",
    compactDisplay: "short",
});

export function decimalFormatter(value: Decimal.Value, locale = "en", currency = "USD") {
    const currencyFormat = resolveCurrencyFormat(locale, currency);
    const decimalValue = new Decimal(value.toString().replace(/,/g, "")).toDecimalPlaces(
        currencyFormat?.minimumFractionDigits,
    );

    return decimalValue.toFixed(currencyFormat?.minimumFractionDigits);
}
