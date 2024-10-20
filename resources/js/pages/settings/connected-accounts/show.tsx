import EqualizerIcon from "virtual:icons/ri/equalizer-line";
import { Head } from "@inertiajs/react";

import { PageHeader } from "#/components/page-header";
import { AppLayout } from "#/layouts/app-layout";
import { SettingsSidebar } from "#/layouts/partials/settings-sidebar";
import ConnectedAccountsForm from "./partials/connected-accounts-form";

export default function SocialAccountsShow() {
	return (
		<AppLayout subSidebar={<SettingsSidebar />}>
			<Head title="Social accounts" />

			<PageHeader>
				<PageHeader.Content>
					<PageHeader.Icon>
						<EqualizerIcon className="size-6" />
					</PageHeader.Icon>

					<div className="flex flex-1 flex-col gap-1">
						<PageHeader.Title>Connected accounts</PageHeader.Title>
						<PageHeader.Description>Manage your social connected accounts.</PageHeader.Description>
					</div>
				</PageHeader.Content>
			</PageHeader>

			<ConnectedAccountsForm />
		</AppLayout>
	);
}
