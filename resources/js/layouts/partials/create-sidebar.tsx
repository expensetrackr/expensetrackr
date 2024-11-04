import { Sidebar, SidebarBody, SidebarFooter, SidebarHeader, SidebarHeading } from "#/components/sidebar.tsx";
import { Text } from "#/components/text.tsx";

export function CreateSidebar() {
    return (
        <Sidebar className="rounded-16 gap-3 bg-[var(--bg-weak-50)]">
            <SidebarHeader className="mx-4 mt-5 p-0">
                <SidebarHeading className="p-0">account creation</SidebarHeading>
            </SidebarHeader>

            <SidebarBody className="mx-4 p-0">
                <small>Put links of steps here</small>
            </SidebarBody>

            <SidebarFooter className="mb-5 border-t-0 p-0">
                <Text className="text-paragraph-xs text-center text-[var(--text-soft-400)]">
                    &copy; {new Date().getFullYear()} ExpenseTrackr
                </Text>
            </SidebarFooter>
        </Sidebar>
    );
}
