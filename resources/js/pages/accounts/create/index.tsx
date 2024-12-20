import { FormProvider, FormStateInput, getFormProps, useForm } from "@conform-to/react";
import { getZodConstraint, parseWithZod } from "@conform-to/zod";
import { Head } from "@inertiajs/react";
import TextboxDuotone from "virtual:icons/ph/textbox-duotone";
import CloseIcon from "virtual:icons/ri/close-line";
import HeadphoneIcon from "virtual:icons/ri/headphone-line";
import ListSettings from "virtual:icons/ri/list-settings-fill";
import MoneyDollarCircleFillIcon from "virtual:icons/ri/money-dollar-circle-fill";

import * as Button from "#/components/ui/button.tsx";
import { BalanceStep } from "#/pages/accounts/create/partials/balance-step.tsx";
import { Card } from "#/pages/accounts/create/partials/card.tsx";
import { TypeStep, type TypeStepValues } from "#/pages/accounts/create/partials/type-step.tsx";
import { useCreateAccountWizardStore } from "#/store/create-account-wizard.ts";
import { DetailsStep } from "./partials/details-type.tsx";
import { FlowSidebar } from "./partials/sidebar.tsx";
import { type BalanceStepValues, type DetailsStepValues, Scoped, useStepper } from "./partials/stepper.ts";

type CreateAccountPageProps = {
    currencies: Array<string>;
};

export default function CreateAccountPage({ currencies }: CreateAccountPageProps) {
    const stepper = useStepper();
    const { type } = useCreateAccountWizardStore();
    const [form, fields] = useForm({
        id: "create-account",
        shouldValidate: "onBlur",
        shouldRevalidate: "onInput",
        constraint: getZodConstraint(stepper.current.schema),
        defaultValue: {
            type,
            initial_balance: "0.00",
        },
        onValidate({ formData }) {
            return parseWithZod(formData, { schema: stepper.current.schema });
        },
        onSubmit(event, { submission }) {
            event.preventDefault();

            console.log(`Form values for step ${stepper.current.id}:`, submission);
            if (stepper.isLast) {
                stepper.reset();
            } else {
                stepper.next();
            }
        },
    });

    console.info("errors", form.allErrors);

    return (
        <>
            <Head title="Create account" />

            <Scoped>
                <div className="flex min-h-screen flex-col lg:grid lg:grid-cols-[auto_minmax(0,1fr)] lg:items-start">
                    <FlowSidebar stepper={stepper} />

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
                            className="fixed top-6 right-8 hidden lg:flex"
                        >
                            <Button.Icon as={CloseIcon} />
                        </Button.Root>

                        <FormProvider context={form.context}>
                            <FormStateInput />

                            <form method="post" {...getFormProps(form)} className="flex w-full justify-center py-12">
                                {stepper.switch({
                                    type: (step) => (
                                        <Card
                                            description="Choose the type of account you want to add."
                                            icon={ListSettings}
                                            key={step.id}
                                            stepper={stepper}
                                            title="Type selection"
                                        >
                                            <TypeStep
                                                fields={fields as ReturnType<typeof useForm<TypeStepValues>>[1]}
                                            />
                                        </Card>
                                    ),
                                    details: (step) => (
                                        <Card
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
            </Scoped>
        </>
    );
}
