import UserIcon from "virtual:icons/ri/user-line";
import { Head } from "@inertiajs/react";
import * as React from "react";

import { Divider } from "#/components/divider";
import { PageHeader } from "#/components/page-header";
import { AppLayout } from "#/layouts/app-layout";
import { SettingsSidebar } from "#/layouts/partials/settings-sidebar";
import { UpdateEmailForm } from "./partials/update-email-form";
import { UpdateNameForm } from "./partials/update-name-form";
import { UpdateProfilePictureForm } from "./partials/update-profile-picture-form";

// Memoize the SettingsSidebar to prevent unnecessary re-renders
const MemoizedSettingsSidebar = React.memo(SettingsSidebar);

export default function SettingsShow() {
	return (
		<AppLayout subSidebar={<MemoizedSettingsSidebar />}>
			<Head title="Profile settings" />

			<PageHeader>
				<PageHeader.Content>
					<PageHeader.Icon>
						<UserIcon className="size-6" />
					</PageHeader.Icon>

					<div className="flex flex-1 flex-col gap-1">
						<PageHeader.Title>Profile Settings</PageHeader.Title>
						<PageHeader.Description>Customize and edit essential profile details.</PageHeader.Description>
					</div>
				</PageHeader.Content>
			</PageHeader>

			<Divider />

			<UpdateProfilePictureForm />

			<Divider className="my-[1.5px]" />

			<UpdateNameForm />

			<Divider className="my-[1.5px]" />

			<UpdateEmailForm />
		</AppLayout>
	);
}
