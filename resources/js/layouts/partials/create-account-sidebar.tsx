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

export function CreateAccountSidebar() {
    return (
        <Sidebar className="rounded-16 gap-3 bg-[var(--bg-weak-50)]">
            <SidebarHeader className="mx-4 mt-5 p-0">
                <SidebarHeading className="p-0">account creation</SidebarHeading>
            </SidebarHeader>

            <SidebarBody className="mx-4 p-0">
                <SidebarSection>
                    <SidebarItem
                        href={route("accounts.create")}
                        current={route().current("accounts.create")}
                        buttonClassName="group rounded-10 p-2 data-hover:bg-[var(--bg-white-0)] data-current:bg-[var(--bg-white-0)]"
                    >
                        <StepNumber>1</StepNumber>
                        <SidebarLabel>Account details</SidebarLabel>
                    </SidebarItem>
                    <SidebarItem buttonClassName="group rounded-10 p-2 data-hover:bg-[var(--bg-white-0)] data-current:bg-[var(--bg-white-0)]">
                        <StepNumber>2</StepNumber>
                        <SidebarLabel>Balance & currency</SidebarLabel>
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

                <Text className="text-paragraph-xs text-center text-[var(--text-soft-400)]">
                    &copy; {new Date().getFullYear()} ExpenseTrackr
                </Text>
            </SidebarFooter>
        </Sidebar>
    );
}

function StepNumber({ children }: { children: React.ReactNode }) {
    return (
        <span className="group-data-hover:bg-primary group-data-current:bg-primary inline-flex items-center justify-center rounded-full bg-[var(--bg-white-0)] p-0.5 shadow-xs">
            <span className="text-label-xs inline-flex size-4 justify-center text-[var(--text-sub-600)] group-data-hover:text-white group-data-current:text-white">
                {children}
            </span>
        </span>
    );
}
