import { type useStepper } from "#/pages/accounts/create/partials/stepper.ts";

type CreateAccountSidebarProps = {
    stepper: ReturnType<typeof useStepper>;
};

export function CreateAccountSidebar({ stepper }: CreateAccountSidebarProps) {
    console.debug("stepper", stepper);

    return null;
    // return (
    //     <Sidebar className="gap-3 lg:rounded-16 lg:bg-(--bg-weak-50)">
    //         <SidebarHeader className="mx-4 mt-5 p-0">
    //             <SidebarHeading className="p-0">account creation</SidebarHeading>
    //         </SidebarHeader>

    //         <SidebarBody className="mx-4 p-0">
    //             <SidebarSection>
    //                 <ol aria-orientation="vertical" className="flex flex-col gap-1">
    //                     {stepper.all.map((step, index) => (
    //                         <SidebarItem
    //                             aria-posinset={index + 1}
    //                             aria-selected={stepper.current.id === step.id}
    //                             aria-setsize={stepper.all.length}
    //                             buttonClassName="group rounded-10 p-2 data-current:bg-(--bg-white-0) data-hover:bg-(--bg-white-0)"
    //                             current={stepper.current.id === step.id}
    //                             currentIndicator={false}
    //                             key={step.id}
    //                             role="tab"
    //                         >
    //                             <StepNumber>{index + 1}</StepNumber>
    //                             <SidebarLabel>{step.label}</SidebarLabel>
    //                         </SidebarItem>
    //                     ))}
    //                 </ol>
    //             </SidebarSection>
    //         </SidebarBody>

    //         <SidebarFooter className="mb-5 flex flex-col gap-3 border-t-0 p-0">
    //             <div className="flex flex-col gap-4">
    //                 <Text className="text-center">Having trouble with creation?</Text>
    //                 <Button.Root $style="stroke" $type="neutral">
    //                     <Button.Icon as={HeadphoneIcon} />
    //                     <span>Contact</span>
    //                 </Button.Root>
    //             </div>

    //             <Text className="text-center text-paragraph-xs text-(--text-soft-400)">
    //                 &copy; {new Date().getFullYear()} ExpenseTrackr
    //             </Text>
    //         </SidebarFooter>
    //     </Sidebar>
    // );
}
