import * as React from "react";
import { toast } from "sonner";

import { AppCommandMenu } from "#/components/commands/app-command-menu.tsx";
import { HeaderMobile } from "#/components/header-mobile.tsx";
import { Sidebar } from "#/components/sidebar.tsx";
import { Toaster } from "#/components/toaster.tsx";
import { type PageProps } from "#/types/globals.js";
import { cn } from "#/utils/cn.ts";

const CreateAccountDrawer = React.lazy(() =>
    import("#/components/drawers/create-account-drawer.tsx").then((m) => ({ default: m.CreateAccountDrawer })),
);
const CreateTransactionDrawer = React.lazy(() =>
    import("#/components/drawers/create-transaction-drawer.tsx").then((m) => ({ default: m.CreateTransactionDrawer })),
);
const DeleteTransactionModal = React.lazy(() =>
    import("#/components/delete-transaction-modal.tsx").then((m) => ({ default: m.DeleteTransactionModal })),
);
const TransactionDetailsDrawer = React.lazy(() =>
    import("#/components/transactions/details-drawer.tsx").then((m) => ({ default: m.TransactionDetailsDrawer })),
);
const CreateCategoryModal = React.lazy(() =>
    import("#/components/modals/create-category-modal.tsx").then((m) => ({ default: m.CreateCategoryModal })),
);
const UpdateCategoryModal = React.lazy(() =>
    import("#/components/modals/update-category-modal.tsx").then((m) => ({ default: m.UpdateCategoryModal })),
);
const DeleteCategoryModal = React.lazy(() =>
    import("#/components/modals/delete-category-modal.tsx").then((m) => ({ default: m.DeleteCategoryModal })),
);

type ModalConfig = {
    component: React.LazyExoticComponent<() => React.JSX.Element>;
    permission?: keyof App.Data.Shared.PermissionsData;
};

type ModalKeys =
    | "createAccount"
    | "createTransaction"
    | "transactionDetails"
    | "deleteTransaction"
    | "createCategory"
    | "updateCategory"
    | "deleteCategory";

const MODALS_CONFIG: Record<ModalKeys, ModalConfig> = {
    createAccount: {
        component: CreateAccountDrawer,
        permission: "canCreateAccounts",
    },
    createTransaction: {
        component: CreateTransactionDrawer,
        permission: "canCreateTransactions",
    },
    transactionDetails: {
        component: TransactionDetailsDrawer,
    },
    deleteTransaction: {
        component: DeleteTransactionModal,
    },
    createCategory: {
        component: CreateCategoryModal,
        permission: "canCreateCategories",
    },
    updateCategory: {
        component: UpdateCategoryModal,
    },
    deleteCategory: {
        component: DeleteCategoryModal,
    },
};

const renderModals = (permissions: App.Data.Shared.PermissionsData) => {
    return Object.entries(MODALS_CONFIG).map(([key, config]) => {
        if (config.permission && !permissions[config.permission]) {
            return null;
        }

        const Component = config.component;
        return <Component key={key} />;
    });
};

type AppLayoutProps = PageProps<{
    children: React.ReactNode;
    defaultCollapsed?: boolean;
    childrenWrapperClassName?: string;
}>;

/**
 * Provides the main application layout with sidebar, header, and content area, handling toast notifications and conditional UI elements based on permissions.
 *
 * @param children - The content to render within the layout.
 * @param defaultCollapsed - Whether the sidebar should be collapsed by default.
 * @param childrenWrapperClassName - Additional CSS classes for the content wrapper.
 *
 * @remark
 * Displays toast notifications when the {@link props.toast} prop changes. Conditionally renders account and transaction drawers based on user permissions.
 */
export function AppLayout({ children, defaultCollapsed = false, childrenWrapperClassName, ...props }: AppLayoutProps) {
    React.useEffect(() => {
        if (props.toast?.type) {
            toast[props.toast.type](props.toast.title, {
                description: props.toast.description,
                duration: props.toast.duration ?? 5000,
            });
        }
    }, [props.toast]);

    return (
        <>
            <div className="flex min-h-screen flex-col items-start lg:grid lg:grid-cols-[auto_minmax(0,1fr)]">
                <Sidebar defaultCollapsed={defaultCollapsed} />
                <HeaderMobile />
                <div
                    className={cn(
                        "mx-auto flex w-full max-w-[1360px] flex-1 flex-col self-stretch pb-16 lg:pb-0",
                        childrenWrapperClassName,
                    )}
                >
                    {children}
                </div>
            </div>

            <Toaster position="top-center" />
            <AppCommandMenu />

            {renderModals(props.permissions)}
        </>
    );
}
