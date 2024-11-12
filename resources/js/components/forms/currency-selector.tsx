import { Combobox } from "@headlessui/react";
import { useQueryState } from "nuqs";

import { ComboboxInput, ComboboxOption, ComboboxOptions } from "../combobox.tsx";
import { ErrorMessage, Field, Label } from "../fieldset.tsx";

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
            <Label>Currency</Label>
            <Combobox
                immediate
                value={value}
                onChange={onChange}
                virtual={{ options: filteredCurrencies }}
                onClose={() => setQuery(null)}
            >
                <ComboboxInput
                    aria-label="Currency"
                    value={query || value}
                    onChange={(event) => setQuery(event.target.value)}
                />

                <ComboboxOptions>
                    {({ option }) => (
                        <ComboboxOption value={option} className="data-[focus]:bg-blue-100">
                            <svg
                                className="size-5 rounded-full"
                                role="img"
                                aria-label={`${option} flag`}
                                preserveAspectRatio="xMidYMid meet"
                            >
                                <use href={`/img/flags.svg#${option}`} />
                            </svg>

                            <span>{option}</span>
                        </ComboboxOption>
                    )}
                </ComboboxOptions>
            </Combobox>
            {error && <ErrorMessage>{error}</ErrorMessage>}
        </Field>
    );
}
