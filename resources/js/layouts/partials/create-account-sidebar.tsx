import { usePage } from "@inertiajs/react";
import CheckboxCircleFillIcon from "virtual:icons/ri/checkbox-circle-fill";
import HeadphoneIcon from "virtual:icons/ri/headphone-line";
import { route } from "ziggy-js";

import { Button } from "#/components/button.tsx";
import {
    Sidebar,
    SidebarBody,
    SidebarFooter,
    SidebarHeader,
    SidebarHeading,
    SidebarItem,
    SidebarLabel,
    SidebarSection,
} from "#/components/sidebar.tsx";
import { Text } from "#/components/text.tsx";

type PageProps = {
    wizard: {
        currentStep: string;
        completedSteps: Record<string, boolean>;
        totalSteps: number;
    };
};

export function CreateAccountSidebar() {
    const page = usePage<PageProps>();
    const completedSteps = page.props.wizard.completedSteps;

    return (
        <Sidebar className="gap-3 lg:rounded-16 lg:bg-(--bg-weak-50)">
            <SidebarHeader className="mx-4 mt-5 p-0">
                <SidebarHeading className="p-0">account creation</SidebarHeading>
            </SidebarHeader>

            <SidebarBody className="mx-4 p-0">
                <SidebarSection>
                    <SidebarItem
                        buttonClassName="group rounded-10 p-2 data-current:!bg-(--bg-white-0) data-hover:!bg-(--bg-white-0)"
                        current={route().current("accounts.create", { step: "details" })}
                        href={route("accounts.create", { step: "details" })}
                    >
                        {completedSteps["details"] ? (
                            <CheckboxCircleFillIcon className="!text-state-success-base" />
                        ) : (
                            <StepNumber>1</StepNumber>
                        )}

                        <SidebarLabel>Details</SidebarLabel>
                    </SidebarItem>
                    <SidebarItem
                        buttonClassName="group rounded-10 p-2 data-current:!bg-(--bg-white-0) data-hover:!bg-(--bg-white-0)"
                        current={route().current("accounts.create", { step: "balance-and-currency" })}
                        href={route("accounts.create", { step: "balance-and-currency" })}
                    >
                        {completedSteps["balance-and-currency"] ? (
                            <CheckboxCircleFillIcon className="!text-state-success-base" />
                        ) : (
                            <StepNumber>2</StepNumber>
                        )}

                        <SidebarLabel>Balance & Currency</SidebarLabel>
                    </SidebarItem>
                    <SidebarItem
                        buttonClassName="group rounded-10 p-2 data-current:!bg-(--bg-white-0) data-hover:!bg-(--bg-white-0)"
                        current={route().current("accounts.create", { step: "review" })}
                        href={route("accounts.create", { step: "review" })}
                    >
                        <StepNumber>3</StepNumber>

                        <SidebarLabel>Account Summary</SidebarLabel>
                    </SidebarItem>
                </SidebarSection>
            </SidebarBody>

            <SidebarFooter className="mb-5 flex flex-col gap-3 border-t-0 p-0">
                <div className="flex flex-col gap-4">
                    <Text className="text-center">Having trouble with creation?</Text>
                    <Button $color="neutral" $variant="stroke">
                        <HeadphoneIcon />
                        <span>Contact</span>
                    </Button>
                </div>

                <Text className="text-center text-paragraph-xs text-(--text-soft-400)">
                    &copy; {new Date().getFullYear()} ExpenseTrackr
                </Text>
            </SidebarFooter>
        </Sidebar>
    );
}

function StepNumber({ children }: { children: React.ReactNode }) {
    return (
        <span className="inline-flex items-center justify-center rounded-full bg-(--bg-white-0) p-0.5 shadow-xs group-data-current:bg-primary group-data-hover:bg-primary">
            <span className="inline-flex size-4 justify-center text-label-xs text-(--text-sub-600) group-data-current:text-white group-data-hover:text-white">
                {children}
            </span>
        </span>
    );
}
