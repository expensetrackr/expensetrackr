import { Head } from "@inertiajs/react";
import ShieldUserIcon from "virtual:icons/ri/shield-user-line";

import { Divider } from "#/components/divider.tsx";
import { PageHeader } from "#/components/page-header.tsx";
import { AppLayout } from "#/layouts/app-layout.tsx";
import { SettingsSidebar } from "#/layouts/partials/settings-sidebar.tsx";
import { SetPasswordForm } from "#/pages/settings/privacy-and-security/partials/set-password-form.tsx";
import { type InertiaSharedProps, type Session } from "#/types/index.ts";
import { DeleteUserForm } from "./partials/delete-user-form.tsx";
import { LogoutOtherBrowserSessionsForm } from "./partials/logout-other-browser-sessions-form.tsx";
import { TwoFactorAuthenticationForm } from "./partials/two-factor-authentication-form.tsx";
import { UpdatePasswordForm } from "./partials/update-password-form.tsx";

type PrivacyAndSecurityShowProps = {
    sessions: Session[];
    confirmsTwoFactorAuthentication: boolean;
};

export default function PrivacyAndSecurityShow({
    sessions,
    confirmsTwoFactorAuthentication,
    ...props
}: InertiaSharedProps<PrivacyAndSecurityShowProps>) {
    const workspaces = props.workspaces;
    const canUpdatePassword = workspaces.canUpdatePassword && props.socialstream.hasPassword;

    return (
        <>
            <Head title="Privacy & Security" />

            <div className="flex flex-col gap-5">
                <PageHeader className="-mb-5">
                    <PageHeader.Content>
                        <PageHeader.Icon>
                            <ShieldUserIcon className="size-6" />
                        </PageHeader.Icon>

                        <div className="flex flex-1 flex-col gap-1">
                            <PageHeader.Title>Privacy & Security</PageHeader.Title>
                            <PageHeader.Description>
                                Personalize your privacy settings and enhance the security of your account.
                            </PageHeader.Description>
                        </div>
                    </PageHeader.Content>
                </PageHeader>

                {workspaces.canUpdatePassword && (
                    <>
                        <Divider />

                        {canUpdatePassword ? <UpdatePasswordForm /> : <SetPasswordForm />}
                    </>
                )}

                {workspaces.canManageTwoFactorAuthentication && (
                    <>
                        <Divider />

                        <TwoFactorAuthenticationForm requiresConfirmation={confirmsTwoFactorAuthentication} />
                    </>
                )}

                <Divider />

                <LogoutOtherBrowserSessionsForm sessions={sessions} />

                {workspaces.hasAccountDeletionFeatures && (
                    <>
                        <Divider />

                        <DeleteUserForm />
                    </>
                )}
            </div>
        </>
    );
}

PrivacyAndSecurityShow.layout = (
    page: React.ReactNode & { props: InertiaSharedProps<PrivacyAndSecurityShowProps> },
) => (
    <AppLayout {...page.props} subSidebar={<SettingsSidebar />}>
        {page}
    </AppLayout>
);
