import { Head, router } from "@inertiajs/react";
import { CurrencyInput } from "headless-currency-input";
import { type NumberFormatValues } from "react-number-format";
import BankIcon from "virtual:icons/ri/bank-line";
import MoneyDollarCircleFillIcon from "virtual:icons/ri/money-dollar-circle-fill";

import { ErrorMessage, Field, Label } from "#/components/fieldset.tsx";
import { AccountForm } from "#/components/form/account-form.tsx";
import { CurrencySelector } from "#/components/form/currency-selector.tsx";
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
        initial_balance: previousData?.initial_balance ?? 0,
        currency_code: previousData?.currency_code ?? "USD",
    });

    function handleSubmit(e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault();

        form.post(route("accounts.store", ["balance-and-currency"]), {
            onSuccess: () => router.visit(route("accounts.create", { step: "review" })),
        });
    }

    function handleChange(key: keyof AccountFormData, value: string) {
        form.setData(key, value);
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
                                <MoneyDollarCircleFillIcon className="size-8 text-[var(--icon-sub-600)]" />
                            </div>
                        </div>

                        <div className="flex flex-col items-center gap-1">
                            <h1 className="text-h5">Balance and currency</h1>
                            <Text className="text-paragraph-md text-center">
                                Provide the balance and currency for your new account.
                            </Text>
                        </div>
                    </div>

                    <div className="rounded-20 mx-auto w-full max-w-[400px] border border-[var(--stroke-soft-200)] bg-[var(--bg-white-0)] shadow-xs">
                        <div className="flex items-center gap-3.5 py-4 pr-6 pl-5">
                            <div className="flex size-10 items-center justify-center rounded-full border border-[var(--stroke-soft-200)]">
                                <BankIcon className="size-5 text-[var(--icon-sub-600)]" />
                            </div>

                            <div className="flex flex-1 flex-col gap-1">
                                <h3 className="text-label-sm">{previousData?.name}</h3>
                                <p className="text-paragraph-sm text-[var(--text-sub-600)]">
                                    Type: {previousData?.type}
                                </p>
                            </div>
                        </div>

                        <div className="bg-[var(--bg-weak-50)] px-4 py-1.5">
                            <p className="text-subheading-xs text-[var(--text-soft-400)] uppercase">account balance</p>
                        </div>

                        <div className="p-4">
                            <AccountForm
                                action={route("accounts.store", ["balance-and-currency"])}
                                id="balance-and-currency-form"
                                onSubmit={handleSubmit}
                            >
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
                                    {form.errors.initial_balance && (
                                        <ErrorMessage>{form.errors.initial_balance}</ErrorMessage>
                                    )}
                                </Field>

                                <CurrencySelector
                                    value={form.data.currency_code}
                                    onChange={(value) => handleChange("currency_code", value)}
                                    currencies={currencies}
                                    error={form.errors.currency_code}
                                />
                            </AccountForm>
                        </div>

                        <AccountForm.Navigation
                            prevStep="details"
                            isSubmitting={form.processing}
                            onSubmit={handleSubmit}
                        />
                    </div>
                </div>
            </div>
        </CreateLayout>
    );
}
