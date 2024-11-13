import * as Headless from "@headlessui/react";
import { useQueryState } from "nuqs";
import ArrowDropDownIcon from "virtual:icons/ri/arrow-drop-down-line";

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
            <Headless.Combobox
                immediate
                value={value}
                onChange={onChange}
                virtual={{ options: filteredCurrencies }}
                onClose={() => setQuery(null)}
            >
                <div className="relative">
                    <ComboboxInput
                        aria-label="Currency"
                        value={query || value}
                        onChange={(event) => setQuery(event.target.value)}
                    />

                    <Headless.ComboboxButton className="group absolute inset-y-0 right-0 px-2.5">
                        <ArrowDropDownIcon className="size-5 fill-white/60 group-data-hover:fill-white" />
                    </Headless.ComboboxButton>
                </div>

                <ComboboxOptions>
                    {({ option }) => (
                        <ComboboxOption value={option}>
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
            </Headless.Combobox>
            {error && <ErrorMessage>{error}</ErrorMessage>}
        </Field>
    );
}
