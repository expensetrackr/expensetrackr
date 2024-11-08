import { Combobox } from "@headlessui/react";
import { Head, router, useForm } from "@inertiajs/react";
import { CurrencyInput } from "headless-currency-input";
import { useQueryState } from "nuqs";
import ArrowLeftIcon from "virtual:icons/ri/arrow-left-line";
import ArrowRightIcon from "virtual:icons/ri/arrow-right-line";
import CurrencyIcon from "virtual:icons/ri/currency-line";

import { Button } from "#/components/button.tsx";
import { ComboboxInput, ComboboxOption, ComboboxOptions } from "#/components/combobox.tsx";
import { ErrorMessage, Field, Label } from "#/components/fieldset.tsx";
import { Input } from "#/components/input.tsx";
import { Text } from "#/components/text.tsx";
import { CreateLayout } from "#/layouts/create-layout.tsx";

type CreateAccountStep2PageProps = {
    currencies: string[];
};

export default function CreateAccountStep2Page({ currencies = [] }: CreateAccountStep2PageProps) {
    const { errors, data, ...form } = useForm({
        initial_balance: 0,
        currency_code: "USD",
    });
    const [query, setQuery] = useQueryState("currency_code");

    function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        form.post(route("accounts.store", [2]), {
            onSuccess: () => router.visit(route("accounts.create", { step: "review" })),
        });
    }

    const filteredCurrencies =
        query === ""
            ? currencies
            : currencies?.filter((currency) => {
                  return currency.toLowerCase().includes(query?.toLowerCase() ?? "");
              });

    return (
        <CreateLayout>
            <Head title="Create account" />

            <div className="relative py-12">
                <div className="flex flex-col gap-6 sm:mx-auto sm:max-w-[540px]">
                    <div className="flex flex-col items-center gap-2">
                        <div className="rounded-full bg-gradient-to-b from-neutral-500/10 to-transparent p-4 backdrop-blur-md">
                            <div className="rounded-full border border-[var(--stroke-soft-200)] bg-[var(--bg-white-0)] p-4">
                                <CurrencyIcon className="size-8 text-[var(--icon-sub-600)]" />
                            </div>
                        </div>

                        <div className="flex flex-col items-center gap-1">
                            <h1 className="text-h5">Balance and currency</h1>
                            <Text className="text-paragraph-md text-center">
                                Provide the balance and currency for your new account.
                            </Text>
                        </div>
                    </div>

                    <form onSubmit={onSubmit} className="flex w-full flex-col gap-5 sm:mx-auto sm:max-w-[352px]">
                        <Field>
                            <Label>Initial balance</Label>
                            <CurrencyInput
                                customInput={Input}
                                invalid={!!errors.initial_balance}
                                name="initial_balance"
                                onValueChange={(value) => form.setData("initial_balance", value.floatValue ?? 0)}
                                placeholder="e.g. 1000"
                                currency={data.currency_code || "USD"}
                            />
                            {errors.initial_balance && <ErrorMessage>{errors.initial_balance}</ErrorMessage>}
                        </Field>

                        <Field>
                            <Label>Currency</Label>
                            <Combobox
                                immediate
                                value={data.currency_code}
                                onChange={(value) => form.setData("currency_code", value ?? "")}
                                virtual={{ options: filteredCurrencies }}
                                onClose={() => setQuery(null)}
                            >
                                <ComboboxInput
                                    aria-label="Currency"
                                    value={query || data.currency_code}
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
                            {errors.currency_code && <ErrorMessage>{errors.currency_code}</ErrorMessage>}
                        </Field>

                        <div className="flex justify-between">
                            <Button
                                $color="neutral"
                                $size="sm"
                                $variant="stroke"
                                href={route("accounts.create", {
                                    step: "details",
                                })}
                                className="px-4"
                            >
                                <ArrowLeftIcon />
                                <span>Back</span>
                            </Button>
                            <Button $size="sm" className="px-4" type="submit">
                                <span>Continue</span>
                                <ArrowRightIcon />
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </CreateLayout>
    );
}
