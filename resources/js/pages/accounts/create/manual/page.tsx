import { FormProvider, FormStateInput, getFormProps, useForm } from "@conform-to/react";
import { Head, Link, useForm as useInertiaForm } from "@inertiajs/react";
import { useLocalStorage } from "@uidotdev/usehooks";
import { parseWithValibot, getValibotConstraint } from "conform-to-valibot";
import type * as v from "valibot";
import TextboxDuotone from "virtual:icons/ph/textbox-duotone";
import CloseIcon from "virtual:icons/ri/close-line";
import FileTextFillIcon from "virtual:icons/ri/file-text-fill";
import HeadphoneIcon from "virtual:icons/ri/headphone-line";
import MoneyDollarCircleFillIcon from "virtual:icons/ri/money-dollar-circle-fill";

import { AccountSummaryStep } from "#/components/create-account/account-summary-step.tsx";
import { BalanceStep } from "#/components/create-account/balance-step.tsx";
import { Card } from "#/components/create-account/card.tsx";
import { DetailsStep } from "#/components/create-account/details-step.tsx";
import { FlowSidebar } from "#/components/create-account/sidebar.tsx";
import * as Button from "#/components/ui/button.tsx";
import { useCreateAccountParams } from "#/hooks/use-create-account-params.ts";
import {
    type BalanceSchema,
    type CreateAccountSchema,
    CreateManualAccountStepper,
    type DetailsSchema,
} from "#/utils/steppers/create-account.step.ts";

type CreateAccountPageProps = {
    currencies: Array<string>;
};

export default function CreateManualAccountPage({ currencies }: CreateAccountPageProps) {
    const stepper = CreateManualAccountStepper.useStepper();
    const { type } = useCreateAccountParams();
    const [account, setAccount] = useLocalStorage<Record<string, unknown> | null>("account", null);
    const { transform, post } = useInertiaForm();
    const [form, fields] = useForm({
        id: `create-account-${stepper.current.id}-form`,
        shouldValidate: "onSubmit",
        shouldRevalidate: "onInput",
        constraint: getValibotConstraint(stepper.current.schema),
        defaultValue: {
            type,
            currency_code: "USD",
            initial_balance: "0.00",
            ...account,
        },
        onValidate({ formData }) {
            return parseWithValibot(formData, { schema: stepper.current.schema });
        },
        onSubmit(event, { submission }) {
            event.preventDefault();

            // check if value key is present on submission object
            if (submission && "value" in submission) {
                setAccount({
                    ...account,
                    ...submission.value,
                });

                if (stepper.isLast) {
                    transform((data) => ({
                        ...data,
                        ...submission.value,
                        ...("initial_balance" in submission.value && {
                            current_balance: submission.value.initial_balance,
                        }),
                    }));

                    post(route("accounts.store"), {
                        onSuccess() {
                            setAccount(null);
                        },
                    });
                } else {
                    stepper.next();
                }
            }
        },
    });

    return (
        <>
            <Head title="Create account manually" />

            <CreateManualAccountStepper.Scoped>
                <div className="flex min-h-screen flex-col lg:grid lg:grid-cols-[auto_minmax(0,1fr)] lg:items-start">
                    <FlowSidebar stepper={stepper} utils={CreateManualAccountStepper.utils} />

                    <div className="relative isolate mx-auto flex w-full max-w-[1392px] flex-1 flex-col">
                        <img
                            alt=""
                            className="pointer-events-none absolute top-0 left-1/2 -z-10 hidden -translate-x-1/2 lg:block"
                            height={456}
                            src="/img/onboarding-pattern.svg"
                            width={964}
                        />

                        <Button.Root
                            $size="xs"
                            $style="ghost"
                            $type="neutral"
                            asChild
                            className="fixed top-6 right-8 hidden lg:flex"
                        >
                            <Link href={route("accounts.create")}>
                                <Button.Icon as={CloseIcon} />
                            </Link>
                        </Button.Root>

                        <FormProvider context={form.context}>
                            <FormStateInput />

                            <form {...getFormProps(form)} className="flex w-full justify-center py-12">
                                {stepper.switch({
                                    details: (step) => (
                                        <Card
                                            actions={
                                                <Button.Root
                                                    $size="sm"
                                                    className="w-full"
                                                    form={`create-account-${step.id}-form`}
                                                    type="submit"
                                                >
                                                    Continue
                                                </Button.Root>
                                            }
                                            description="Enter your account's name and any additional details. The available options are customized based on your selected account type."
                                            icon={TextboxDuotone}
                                            key={step.id}
                                            stepper={stepper}
                                            title="Account details"
                                        >
                                            <DetailsStep
                                                fields={
                                                    fields as ReturnType<
                                                        typeof useForm<v.InferOutput<typeof DetailsSchema>>
                                                    >[1]
                                                }
                                            />
                                        </Card>
                                    ),
                                    balance: (step) => (
                                        <Card
                                            actions={
                                                <Button.Root
                                                    $size="sm"
                                                    className="w-full"
                                                    form={`create-account-${step.id}-form`}
                                                    type="submit"
                                                >
                                                    Continue
                                                </Button.Root>
                                            }
                                            description="Enter your account's balance and currency. The available options are customized based on your selected account type."
                                            icon={MoneyDollarCircleFillIcon}
                                            key={step.id}
                                            stepper={stepper}
                                            title="Balance & Currency"
                                        >
                                            <BalanceStep
                                                currencies={currencies}
                                                fields={
                                                    fields as ReturnType<
                                                        typeof useForm<v.InferOutput<typeof BalanceSchema>>
                                                    >[1]
                                                }
                                            />
                                        </Card>
                                    ),
                                    summary: (step) => (
                                        <Card
                                            actions={
                                                <Button.Root
                                                    $size="sm"
                                                    className="w-full"
                                                    form={`create-account-${step.id}-form`}
                                                    type="submit"
                                                >
                                                    Continue
                                                </Button.Root>
                                            }
                                            className="[&_[data-card-content]]:p-0"
                                            description="Review your account's details and confirm the information is correct."
                                            icon={FileTextFillIcon}
                                            key={step.id}
                                            stepper={stepper}
                                            title="Account Summary"
                                        >
                                            <AccountSummaryStep
                                                fields={
                                                    fields as ReturnType<
                                                        typeof useForm<v.InferOutput<typeof CreateAccountSchema>>
                                                    >[1]
                                                }
                                            />
                                        </Card>
                                    ),
                                })}
                            </form>
                        </FormProvider>

                        <div className="mx-auto flex w-full max-w-md flex-col gap-3 p-4 lg:hidden">
                            <div className="flex flex-col gap-4 text-center">
                                <div className="text-paragraph-sm text-(--text-sub-600)">
                                    Having trouble with account creation?
                                </div>
                                <Button.Root $style="stroke" $type="neutral">
                                    <Button.Icon as={HeadphoneIcon} />
                                    Contact
                                </Button.Root>
                            </div>

                            <div className="text-center text-paragraph-xs text-(--text-soft-400)">
                                © {new Date().getFullYear()} ExpenseTrackr
                            </div>
                        </div>
                    </div>
                </div>
            </CreateManualAccountStepper.Scoped>
        </>
    );
}
