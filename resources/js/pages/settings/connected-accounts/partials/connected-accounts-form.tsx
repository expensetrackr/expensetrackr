import ShareIcon from "virtual:icons/ri/share-line";
import { useForm, usePage } from "@inertiajs/react";
import { useQueryState } from "nuqs";
import { route } from "ziggy-js";

import { ActionSection } from "#/components/action-section.tsx";
import { Button } from "#/components/button.tsx";
import { ConnectedAccount } from "#/components/connected-account.tsx";
import {
	Dialog,
	DialogActions,
	DialogBody,
	DialogDescription,
	DialogHeader,
	DialogIcon,
	DialogTitle,
} from "#/components/dialog.tsx";
import type { InertiaSharedProps } from "#/types/index.d.ts";

export default function ConnectedAccountsForm() {
	const [action, setAction] = useQueryState("action");
	const page = usePage<InertiaSharedProps>();
	const form = useForm({
		_method: "DELETE",
		bag: "removeConnectedAccount",
	});
	const socialStream = page.props.socialstream;

	function onSubmit(e: React.FormEvent) {
		e.preventDefault();

		const id = action?.split("destroy:connected-accounts:")[1];
		if (!id) return;

		form.post(route("connected-accounts.destroy", { id }), {
			preserveScroll: true,
			async onSuccess() {
				await setAction(null);
			},
		});
	}

	function hasAccountForProvider(provider: string) {
		return socialStream.connectedAccounts.some((account) => account.provider === provider);
	}

	function getAccountForProvider(provider: string) {
		if (hasAccountForProvider(provider)) {
			return socialStream.connectedAccounts.find((account) => account.provider === provider);
		}
	}

	function onRemoveAccount(provider: string) {
		const account = getAccountForProvider(provider);

		if (account) {
			return setAction(`destroy:connected-accounts:${account.id}`);
		}
	}
	return (
		<ActionSection>
			<div className="flex flex-col divide-y divide-[--stroke-soft-200]">
				{socialStream.providers?.map((provider) => {
					const connectedAccount = socialStream.connectedAccounts.find((account) => {
						return account.provider === provider.id;
					});

					const canRemoveConnectedAccount = socialStream.connectedAccounts.length > 1 || socialStream.hasPassword;

					return (
						<ConnectedAccount key={provider.id} provider={provider} connectedAccount={connectedAccount}>
							{connectedAccount ? (
								<>
									{canRemoveConnectedAccount ? (
										<Button
											$color="error"
											$variant="stroke"
											$size="sm"
											className="px-4"
											onClick={() => onRemoveAccount(provider.id)}
										>
											Remove account
										</Button>
									) : null}
								</>
							) : (
								<Button
									$variant="stroke"
									$size="sm"
									href={route("oauth.redirect", { provider: provider.id })}
									className="px-4"
								>
									Connect account
								</Button>
							)}

							<Dialog open={action === `destroy:connected-accounts:${provider.id}`} onClose={() => setAction(null)}>
								<DialogHeader>
									<DialogIcon>
										<ShareIcon className="size-6 text-[var(--icon-sub-600)]" />
									</DialogIcon>

									<div className="flex flex-1 flex-col gap-1">
										<DialogTitle>Are you sure you want to remove this account?</DialogTitle>
										<DialogDescription>
											This will remove the account from your connected accounts list.
										</DialogDescription>
									</div>
								</DialogHeader>

								<DialogBody>
									<form id={`destroy-connected-accounts-${provider.id}-form`} onSubmit={onSubmit} className="sr-only" />
								</DialogBody>

								<DialogActions>
									<Button
										$color="neutral"
										$variant="stroke"
										$size="sm"
										disabled={form.processing}
										className="w-full"
										onClick={() => setAction(null)}
									>
										Cancel
									</Button>
									<Button
										$color="error"
										$size="sm"
										disabled={form.processing}
										form={`destroy-connected-accounts-${provider.id}-form`}
										type="submit"
										className="w-full"
									>
										{form.processing ? "Removing..." : "Yes, remove it"}
									</Button>
								</DialogActions>
							</Dialog>
						</ConnectedAccount>
					);
				})}
			</div>
		</ActionSection>
	);
}
