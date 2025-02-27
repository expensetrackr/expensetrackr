import { Head, Link } from "@inertiajs/react";
import CloseIcon from "virtual:icons/ri/close-line";
import HeadphoneIcon from "virtual:icons/ri/headphone-line";
import MenuSearchIcon from "virtual:icons/ri/menu-search-line";

import { BankSelection } from "#/components/create-account/bank-selection.tsx";
import { Card } from "#/components/create-account/card.tsx";
import { FlowSidebar } from "#/components/create-account/sidebar.tsx";
import * as Button from "#/components/ui/button.tsx";
import { type InstitutionSearchResult } from "#/types/index.ts";
import { createConnectAccount } from "#/utils/steppers/create-account.steps.ts";

type CreateAccountConnectPageProps = {
    institutions: Array<InstitutionSearchResult>;
};

export default function CreateAccountConnectPage({ institutions }: CreateAccountConnectPageProps) {
    const stepper = createConnectAccount.useStepper();

    return (
        <>
            <Head title="Connect your bank account" />

            <createConnectAccount.Scoped>
                <div className="flex min-h-screen flex-col lg:grid lg:grid-cols-[auto_minmax(0,1fr)] lg:items-start">
                    <FlowSidebar stepper={stepper} utils={createConnectAccount.utils} />

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

                        <div className="flex w-full justify-center py-12">
                            {stepper.switch({
                                "bank-selection": (step) => (
                                    <Card
                                        className="[&_[data-card-content-wrapper]]:ring-0 [&_[data-card-content]]:p-0"
                                        description="Choose a bank to connect your account from our list of supported banks."
                                        icon={MenuSearchIcon}
                                        key={step.id}
                                        stepper={stepper}
                                        title="Bank selection"
                                    >
                                        <BankSelection institutions={institutions} />
                                    </Card>
                                ),
                            })}
                        </div>

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
            </createConnectAccount.Scoped>
        </>
    );
}
