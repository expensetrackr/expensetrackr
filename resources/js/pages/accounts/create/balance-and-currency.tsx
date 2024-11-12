import { Head, router } from "@inertiajs/react";
import { CurrencyInput } from "headless-currency-input";
import { type NumberFormatValues } from "react-number-format";
import CurrencyIcon from "virtual:icons/ri/currency-line";

import { ErrorMessage, Field, Label } from "#/components/fieldset.tsx";
import { AccountForm } from "#/components/forms/account-form.tsx";
import { CurrencySelector } from "#/components/forms/currency-selector.tsx";
import { Input } from "#/components/input.tsx";
import { Text } from "#/components/text.tsx";
import { useAccountForm } from "#/hooks/use-account-form.ts";
import { CreateLayout } from "#/layouts/create-layout.tsx";
import { type AccountFormData } from "#/models/account.ts";

interface CreateAccountStep2PageProps {
    currencies: string[];
    previousData?: Partial<AccountFormData>;
}

export default function CreateAccountStep2Page({ currencies, previousData }: CreateAccountStep2PageProps) {
    const form = useAccountForm({
        ...previousData,
        initial_balance: 0,
        currency_code: "USD",
    });

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        form.post(route("accounts.store", ["balance-and-currency"]), {
            onSuccess: () => router.visit(route("accounts.create", { step: "review" })),
        });
    }

    function handleCurrencyChange(value: string) {
        form.setData("currency_code", value);
    }

    function handleBalanceChange(value: NumberFormatValues) {
        form.setData("initial_balance", value.floatValue ?? 0);
    }

    return (
        <CreateLayout>
            <Head title="Balance and Currency - Create Account" />

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

                    <AccountForm step="balance-and-currency" onSubmit={handleSubmit}>
                        <Field>
                            <Label>Initial balance</Label>
                            <CurrencyInput
                                customInput={Input}
                                invalid={!!form.errors.initial_balance}
                                name="initial_balance"
                                onValueChange={handleBalanceChange}
                                placeholder="e.g. 1000"
                                currency={form.data.currency_code || "USD"}
                            />
                            {form.errors.initial_balance && <ErrorMessage>{form.errors.initial_balance}</ErrorMessage>}
                        </Field>

                        <CurrencySelector
                            value={form.data.currency_code}
                            onChange={handleCurrencyChange}
                            currencies={currencies}
                            error={form.errors.currency_code}
                        />

                        <AccountForm.Navigation prevStep="details" isSubmitting={form.processing} />
                    </AccountForm>
                </div>
            </div>
        </CreateLayout>
    );
}
