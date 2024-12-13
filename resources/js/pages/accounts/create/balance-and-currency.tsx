import { Head, router } from "@inertiajs/react";
import { resolveCurrencyFormat } from "@sumup/intl";
import Decimal from "decimal.js";
import { CurrencyInput } from "headless-currency-input";
import { type NumberFormatValues } from "react-number-format";
import BankIcon from "virtual:icons/ri/bank-line";
import MoneyDollarCircleFillIcon from "virtual:icons/ri/money-dollar-circle-fill";

import { AccountForm } from "#/components/form/account-form.tsx";
import { CurrencySelector } from "#/components/form/currency-selector.tsx";
import { Field, Hint, Label } from "#/components/form/fieldset.tsx";
import { Input } from "#/components/form/old-input.tsx";
import { Text } from "#/components/text.tsx";
import { useAccountForm } from "#/hooks/use-account-form.ts";
import { CreateLayout } from "#/layouts/create-layout.tsx";
import { type AccountFormData } from "#/models/account.ts";
import { type InertiaSharedProps } from "#/types/index.ts";

type CreateAccountStep2PageProps = {
    currencies: string[];
    formData?: Partial<AccountFormData>;
};

export default function CreateAccountStep2Page({
    currencies,
    formData,
}: InertiaSharedProps<CreateAccountStep2PageProps>) {
    const form = useAccountForm({
        ...formData,
        initial_balance: formData?.initial_balance ?? "0.00",
        currency_code: formData?.currency_code ?? "USD",
    });
    const currencyFormat = resolveCurrencyFormat("en", form.data.currency_code || "USD");

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
        const decimalValue = new Decimal(value.value).toDecimalPlaces(currencyFormat?.minimumFractionDigits);
        form.setData("initial_balance", decimalValue.toFixed(currencyFormat?.minimumFractionDigits));
    }

    return (
        <div className="relative py-12">
            <div className="flex flex-col gap-6 sm:mx-auto sm:max-w-[540px]">
                <div className="flex flex-col items-center gap-2">
                    <div className="rounded-full bg-gradient-to-b from-neutral-500/10 to-transparent p-4 backdrop-blur-md">
                        <div className="rounded-full border border-(--stroke-soft-200) bg-(--bg-white-0) p-4">
                            <MoneyDollarCircleFillIcon className="size-8 text-(--icon-sub-600)" />
                        </div>
                    </div>

                    <div className="flex flex-col items-center gap-1">
                        <h1 className="text-h5">Balance and currency</h1>
                        <Text className="text-center text-paragraph-md">
                            Provide the balance and currency for your new account.
                        </Text>
                    </div>
                </div>

                <div className="mx-auto w-full max-w-[400px] rounded-20 border border-(--stroke-soft-200) bg-(--bg-white-0) shadow-xs">
                    <div className="flex items-center gap-3.5 py-4 pr-6 pl-5">
                        <div className="flex size-10 items-center justify-center rounded-full border border-(--stroke-soft-200)">
                            <BankIcon className="size-5 text-(--icon-sub-600)" />
                        </div>

                        <div className="flex flex-1 flex-col gap-1">
                            <h3 className="text-label-sm">{formData?.name}</h3>
                            <p className="text-paragraph-sm text-(--text-sub-600)">Type: {formData?.type}</p>
                        </div>
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
                                    currency={form.data.currency_code || "USD"}
                                    customInput={Input}
                                    invalid={!!form.errors.initial_balance}
                                    locale="en"
                                    name="initial_balance"
                                    onValueChange={handleBalanceChange}
                                    placeholder="e.g. 1000"
                                    value={form.data.initial_balance}
                                />
                                {form.errors.initial_balance && <Hint invalid>{form.errors.initial_balance}</Hint>}
                            </Field>

                            <CurrencySelector
                                currencies={currencies}
                                error={form.errors.currency_code}
                                onChange={(value) => handleChange("currency_code", value)}
                                value={form.data.currency_code}
                            />
                        </AccountForm>
                    </div>

                    <AccountForm.Navigation isSubmitting={form.processing} onSubmit={handleSubmit} prevStep="details" />
                </div>
            </div>
        </div>
    );
}

CreateAccountStep2Page.layout = (page: React.ReactNode & { props: InertiaSharedProps }) => (
    <CreateLayout {...page.props}>
        <Head title="Balance and Currency - Create Account" />

        {page}
    </CreateLayout>
);
