import ShieldUserIcon from "virtual:icons/ri/shield-user-line";
import { Head, usePage } from "@inertiajs/react";

import { Divider } from "#/components/divider";
import { PageHeader } from "#/components/page-header";
import { AppLayout } from "#/layouts/app-layout";
import { SettingsSidebar } from "#/layouts/partials/settings-sidebar";
import { SetPasswordForm } from "#/pages/settings/privacy-and-security/partials/set-password-form";
import type { InertiaSharedProps, Session } from "#/types";
import { TwoFactorAuthenticationForm } from "./partials/two-factor-authentication-form";
import { UpdatePasswordForm } from "./partials/update-password-form";

interface PrivacyAndSecurityShowProps {
	sessions: Session[];
	confirmsTwoFactorAuthentication: boolean;
}

export default function PrivacyAndSecurityShow({
	sessions,
	confirmsTwoFactorAuthentication,
	...props
}: PrivacyAndSecurityShowProps) {
	const page = usePage<InertiaSharedProps>();
	const canUpdatePassword = page.props.workspaces.canUpdatePassword && page.props.socialstream.hasPassword;

	console.info({ props });

	return (
		<AppLayout subSidebar={<SettingsSidebar />}>
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

				{page.props.workspaces.canUpdatePassword && (
					<>
						<Divider />

						{canUpdatePassword ? <UpdatePasswordForm /> : <SetPasswordForm />}
					</>
				)}

				{page.props.workspaces.canManageTwoFactorAuthentication && (
					<>
						<Divider />

						<TwoFactorAuthenticationForm requiresConfirmation={confirmsTwoFactorAuthentication} />
					</>
				)}
			</div>
		</AppLayout>
	);
}
