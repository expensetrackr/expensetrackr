import { Head, Link } from "@inertiajs/react";
import CloseIcon from "virtual:icons/ri/close-line";
import HeadphoneIcon from "virtual:icons/ri/headphone-line";
import LinksIcon from "virtual:icons/ri/links-line";
import ListSettings from "virtual:icons/ri/list-settings-fill";

import { Card } from "#/components/create-account/card.tsx";
import { ConnectionTypeStep } from "#/components/create-account/connection-type-step.tsx";
import { FlowSidebar } from "#/components/create-account/sidebar.tsx";
import { TypeStep } from "#/components/create-account/type-step.tsx";
import * as Button from "#/components/ui/button.tsx";
import { useCreateAccountParams } from "#/hooks/use-create-account-params.ts";
import { routes } from "#/routes.ts";
import { CreateAccountStepper } from "#/utils/steppers/create-account.step";

export default function CreateAccountPage() {
    const stepper = CreateAccountStepper.useStepper();
    const { type, connectionType } = useCreateAccountParams();

    return (
        <>
            <Head title="Create account" />

            <CreateAccountStepper.Scoped>
                <div className="flex min-h-screen flex-col lg:grid lg:grid-cols-[auto_minmax(0,1fr)] lg:items-start">
                    <FlowSidebar stepper={stepper} utils={CreateAccountStepper.utils} />

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
                            <Link href={routes.accounts.index.url()}>
                                <Button.Icon as={CloseIcon} />
                            </Link>
                        </Button.Root>

                        <div className="flex w-full justify-center py-12">
                            {stepper.when("type", (step) => (
                                <Card
                                    actions={
                                        type && (
                                            <Button.Root $size="sm" className="w-full" onClick={stepper.next}>
                                                Continue
                                            </Button.Root>
                                        )
                                    }
                                    description="Choose the type of account you want to add."
                                    icon={ListSettings}
                                    key={step.id}
                                    stepper={stepper}
                                    title="Type selection"
                                >
                                    <TypeStep />
                                </Card>
                            ))}
                            {stepper.when("connection_type", (step) => (
                                <Card
                                    actions={
                                        connectionType && (
                                            <Button.Root $size="sm" asChild className="w-full" type="submit">
                                                <Link
                                                    href={routes.accounts.create.connectionType.url(
                                                        {
                                                            connectionType,
                                                        },
                                                        {
                                                            query: { type },
                                                        },
                                                    )}
                                                >
                                                    Continue
                                                </Link>
                                            </Button.Root>
                                        )
                                    }
                                    description="Choose how you want to connect your account."
                                    icon={LinksIcon}
                                    key={step.id}
                                    stepper={stepper}
                                    title="Connection"
                                >
                                    <ConnectionTypeStep />
                                </Card>
                            ))}
                        </div>

                        <div className="mx-auto flex w-full max-w-md flex-col gap-3 p-4 lg:hidden">
                            <div className="flex flex-col gap-4 text-center">
                                <div className="text-paragraph-sm text-(--text-sub-600)">
                                    Having trouble with account creation?
                                </div>
                                <Button.Root $style="stroke" $type="neutral" asChild>
                                    <a
                                        href="mailto:support@expensetrackr.app"
                                        rel="noopener noreferrer"
                                        target="_blank"
                                    >
                                        <Button.Icon as={HeadphoneIcon} />
                                        Contact
                                    </a>
                                </Button.Root>
                            </div>

                            <div className="text-center text-paragraph-xs text-(--text-soft-400)">
                                © {new Date().getFullYear()} {import.meta.env.VITE_APP_NAME}
                            </div>
                        </div>
                    </div>
                </div>
            </CreateAccountStepper.Scoped>
        </>
    );
}
