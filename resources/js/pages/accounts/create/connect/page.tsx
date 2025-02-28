import { Head, Link } from "@inertiajs/react";
import CloseIcon from "virtual:icons/ri/close-line";
import HeadphoneIcon from "virtual:icons/ri/headphone-line";
import MenuSearchIcon from "virtual:icons/ri/menu-search-line";

import { Card } from "#/components/create-account/card.tsx";
import { InstitutionSelection } from "#/components/create-account/institution-selection.tsx";
import { FlowSidebar } from "#/components/create-account/sidebar.tsx";
import * as Button from "#/components/ui/button.tsx";
import { useConnectParams } from "#/hooks/use-connect-params.ts";
import { ConnectAccountStepper } from "#/utils/steppers/create-account.steps.ts";

type CreateAccountConnectPageProps = {
    institutions: Array<App.Data.SearchableInstitutionData>;
    bankAccounts: Array<App.Data.Teller.AccountData>;
};

export default function CreateAccountConnectPage({ institutions, bankAccounts }: CreateAccountConnectPageProps) {
    const { step } = useConnectParams();

    return (
        <>
            <Head title="Connect your bank account" />

            <ConnectAccountStepper.Scoped initialStep={step}>
                <PageContent bankAccounts={bankAccounts} institutions={institutions} />
            </ConnectAccountStepper.Scoped>
        </>
    );
}

function PageContent({ institutions, bankAccounts }: CreateAccountConnectPageProps) {
    const stepper = ConnectAccountStepper.useStepper();

    console.info(bankAccounts);
    return (
        <div className="flex min-h-screen flex-col lg:grid lg:grid-cols-[auto_minmax(0,1fr)] lg:items-start">
            <FlowSidebar stepper={stepper} utils={ConnectAccountStepper.utils} />

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
                        "institution-selection": (step) => (
                            <Card
                                className="[&_[data-card-content-wrapper]]:ring-0 [&_[data-card-content]]:p-0"
                                description="Choose an institution to connect your account from our list of supported institutions."
                                icon={MenuSearchIcon}
                                key={step.id}
                                stepper={stepper}
                                title="Institution selection"
                            >
                                <InstitutionSelection institutions={institutions} />
                            </Card>
                        ),
                        "bank-accounts-selection": (step) => (
                            <Card
                                className="[&_[data-card-content-wrapper]]:ring-0 [&_[data-card-content]]:p-0"
                                description="Choose a bank account to connect your account from our list of supported bank accounts."
                                icon={MenuSearchIcon}
                                stepper={stepper}
                                title="Bank accounts selection"
                            >
                                Hola
                            </Card>
                        ),
                    })}
                </div>

                <div className="mx-auto flex w-full max-w-md flex-col gap-3 p-4 lg:hidden">
                    <div className="flex flex-col gap-4 text-center">
                        <div className="text-paragraph-sm text-(--text-sub-600)">Having trouble with transfer?</div>
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
    );
}
