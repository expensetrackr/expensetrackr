import { resolveCurrencyFormat } from "@sumup/intl";
import { type Currency, type Locale } from "@sumup/intl/dist/es/types";

type CurrencyFormatterOptions = {
    locale?: Locale | Array<Locale>;
    currency?: Currency;
};

export function currencyFormatter(opts?: CurrencyFormatterOptions | null) {
    const { locale = "en", currency = "USD" } = opts || {};
    const format = resolveCurrencyFormat(locale, currency);

    if (!format) {
        throw new Error("Currency format not found");
    }

    return new Intl.NumberFormat("en-US", format);
}

export const compactNumFormatter = new Intl.NumberFormat("en-US", {
    notation: "compact",
    compactDisplay: "short",
});
