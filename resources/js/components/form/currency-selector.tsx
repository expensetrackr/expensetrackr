import * as Headless from "@headlessui/react";
import { useQueryState } from "nuqs";
import ArrowDownSIcon from "virtual:icons/ri/arrow-down-s-line";

import { ComboboxInput, ComboboxOption, ComboboxOptions } from "../combobox.tsx";
import { Field, Hint, Label } from "./fieldset.tsx";

interface CurrencySelectorProps {
    value: string;
    onChange: (value: string) => void;
    currencies: string[];
    error?: string;
}

export function CurrencySelector({ value, onChange, currencies, error }: CurrencySelectorProps) {
    const [query, setQuery] = useQueryState("currency_code");

    const filteredCurrencies = !query
        ? currencies
        : currencies?.filter((currency) => currency.toLowerCase().includes(query?.toLowerCase() ?? ""));

    return (
        <Field>
            <Label className="sr-only">Currency</Label>
            <Headless.Combobox
                immediate
                onChange={onChange}
                onClose={() => setQuery(null)}
                value={value}
                virtual={{ options: filteredCurrencies }}
            >
                <div className="relative">
                    <ComboboxInput
                        aria-label="Currency"
                        onChange={(event) => setQuery(event.target.value)}
                        value={query || value}
                    />

                    <Headless.ComboboxButton className="group absolute inset-y-0 right-0 px-2.5">
                        <ArrowDownSIcon className="size-5 text-(--text-sub-600) transition duration-200 ease-out group-data-focus:text-(--text-strong-950) group-data-hover:text-(--text-strong-950) group-data-open:rotate-180" />
                    </Headless.ComboboxButton>
                </div>

                <ComboboxOptions>
                    {({ option }) => (
                        <ComboboxOption value={option}>
                            <svg
                                aria-label={`${option} flag`}
                                className="size-5 rounded-full"
                                preserveAspectRatio="xMidYMid meet"
                                role="img"
                            >
                                <use href={`/img/flags.svg#${option}`} />
                            </svg>

                            <span>{option}</span>
                        </ComboboxOption>
                    )}
                </ComboboxOptions>
            </Headless.Combobox>
            {error && <Hint invalid>{error}</Hint>}
        </Field>
    );
}
