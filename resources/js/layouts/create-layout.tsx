import { SidebarLayout } from "#/components/sidebar-layout.tsx";
import { CreateAccountSidebar } from "#/layouts/partials/create-account-sidebar.tsx";

export function CreateLayout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarLayout
            sidebar={<CreateAccountSidebar />}
            sidebarClassName="lg:pl-2 lg:py-2"
            contentClassName="lg:pt-0 lg:pr-0"
            contentChildrenClassName="relative lg:ring-0"
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="966"
                height="456"
                viewBox="0 0 966 456"
                fill="none"
                className="absolute left-1/2 -translate-x-1/2 text-neutral-500"
            >
                <path
                    d="M1.00004 0L1 456M69.8572 0L69.8571 456M138.714 0L138.714 456M207.571 0L207.571 456M276.429 0L276.429 456M345.286 0L345.286 456M414.143 0L414.143 456M483 0L483 456M551.857 0V456M620.714 0L620.714 456M689.571 0V456M758.428 0V456M827.286 0V456M896.143 0V456M965 0V456"
                    stroke="url(#paint0_linear_3974_25638)"
                    strokeOpacity="0.16"
                />
                <defs>
                    <linearGradient
                        id="paint0_linear_3974_25638"
                        x1="483"
                        y1="0"
                        x2="483"
                        y2="456"
                        gradientUnits="userSpaceOnUse"
                    >
                        <stop stopColor="currentColor" />
                        <stop offset="1" stopColor="currentColor" stopOpacity="0" />
                    </linearGradient>
                </defs>
            </svg>

            {children}
        </SidebarLayout>
    );
}
