import { Head, router, useForm } from "@inertiajs/react";
import { CurrencyInput } from "headless-currency-input";
import ArrowLeftIcon from "virtual:icons/ri/arrow-left-line";
import ArrowRightIcon from "virtual:icons/ri/arrow-right-line";
import CurrencyIcon from "virtual:icons/ri/currency-line";

import { Button } from "#/components/button.tsx";
import { ErrorMessage, Field, Label } from "#/components/fieldset.tsx";
import { Input } from "#/components/input.tsx";
import { Text } from "#/components/text.tsx";
import { CreateLayout } from "#/layouts/create-layout.tsx";

export default function CreateAccountStep2Page() {
    const { errors, data, ...form } = useForm({
        initial_balance: "",
        currency_code: "",
    });

    function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        form.post(route("accounts.store", [2]), {
            onSuccess: () => router.visit(route("accounts.create", { step: "review" })),
        });
    }

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
                                // @ts-expect-error - TODO: fix this on library internally
                                invalid={!!errors.initial_balance}
                                name="initial_balance"
                                onValueChange={(value) => form.setData("initial_balance", value.value)}
                                value={data.initial_balance}
                                placeholder="e.g. 1000"
                            />
                            {errors.initial_balance && <ErrorMessage>{errors.initial_balance}</ErrorMessage>}
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
