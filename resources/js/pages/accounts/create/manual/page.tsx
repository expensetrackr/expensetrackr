import { FormProvider, FormStateInput, getFormProps, useForm } from "@conform-to/react";
import { getZodConstraint, parseWithZod } from "@conform-to/zod";
import { Head, Link } from "@inertiajs/react";
import TextboxDuotone from "virtual:icons/ph/textbox-duotone";
import CloseIcon from "virtual:icons/ri/close-line";
import HeadphoneIcon from "virtual:icons/ri/headphone-line";
import MoneyDollarCircleFillIcon from "virtual:icons/ri/money-dollar-circle-fill";

import { BalanceStep } from "#/components/create-account/balance-step.tsx";
import { Card } from "#/components/create-account/card.tsx";
import { DetailsStep } from "#/components/create-account/details-step.tsx";
import { FlowSidebar } from "#/components/create-account/sidebar.tsx";
import * as Button from "#/components/ui/button.tsx";
import { useCreateAccountStates } from "#/hooks/use-create-account-states.ts";
import {
    type BalanceStepValues,
    createManualAccount,
    type DetailsStepValues,
} from "#/utils/steppers/create-account.steps";

type CreateAccountPageProps = {
    currencies: Array<string>;
};

export default function CreateManualAccountPage({ currencies }: CreateAccountPageProps) {
    const stepper = createManualAccount.useStepper();
    const { state } = useCreateAccountStates();
    const [form, fields] = useForm({
        id: "create-account",
        shouldValidate: "onSubmit",
        shouldRevalidate: "onInput",
        constraint: getZodConstraint(stepper.current.schema),
        defaultValue: {
            ...state,
            initial_balance: "0.00",
        },
        onValidate({ formData }) {
            return parseWithZod(formData, { schema: stepper.current.schema });
        },
        onSubmit(event, { submission }) {
            event.preventDefault();

            console.info("submission:", submission);

            console.log(`Form values for step ${stepper.current.id}:`, submission);
            if (stepper.isLast) {
                stepper.reset();
            } else {
                stepper.next();
            }
        },
    });

    return (
        <>
            <Head title="Create account manually" />

            <createManualAccount.Scoped>
                <div className="flex min-h-screen flex-col lg:grid lg:grid-cols-[auto_minmax(0,1fr)] lg:items-start">
                    <FlowSidebar stepper={stepper} utils={createManualAccount.utils} />

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

                            <form method="post" {...getFormProps(form)} className="flex w-full justify-center py-12">
                                {stepper.switch({
                                    details: (step) => (
                                        <Card
                                            actions={
                                                <Button.Root $size="sm" className="w-full" form={form.id} type="submit">
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
                                                fields={fields as ReturnType<typeof useForm<DetailsStepValues>>[1]}
                                            />
                                        </Card>
                                    ),
                                    balance: (step) => (
                                        <Card
                                            actions={
                                                <Button.Root $size="sm" className="w-full" form={form.id} type="submit">
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
                                                fields={fields as ReturnType<typeof useForm<BalanceStepValues>>[1]}
                                            />
                                        </Card>
                                    ),
                                })}
                            </form>
                        </FormProvider>

                        <div className="mx-auto flex w-full max-w-md flex-col gap-3 p-4 lg:hidden">
                            <div className="flex flex-col gap-4 text-center">
                                <div className="text-paragraph-sm text-(--text-sub-600)">
                                    Having trouble with transfer?
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
            </createManualAccount.Scoped>
        </>
    );
}
