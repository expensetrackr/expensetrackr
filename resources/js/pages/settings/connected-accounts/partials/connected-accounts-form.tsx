import { useForm, usePage } from "@inertiajs/react";
import { useState } from "react";

import { ActionSection } from "#/components/action-section";
import { Button } from "#/components/button";
import { ConnectedAccount } from "#/components/connected-account";
import type { ConnectedAccountType, InertiaSharedProps } from "#/types";

export default function ConnectedAccountsForm() {
	const [isOpen, setOpen] = useState(false);
	const [accountId, setAccountId] = useState<number>();
	const page = usePage<InertiaSharedProps>();
	const form = useForm({
		_method: "DELETE",
		bag: "removeConnectedAccount",
	});
	const socialStream = page.props.socialstream;

	function removeConnectedAccount(id: ConnectedAccountType["id"]) {
		form.post(route("connected-accounts.destroy", { id }), {
			preserveScroll: true,
			onSuccess: () => {
				setOpen(false);
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

	function confirmRemove(id: ConnectedAccountType["id"]) {
		setAccountId(id);
		setOpen(true);
	}

	function onRemoveAccount(provider: string) {
		const account = getAccountForProvider(provider);

		if (account) {
			return confirmRemove(account.id);
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
						</ConnectedAccount>
					);
				})}
			</div>
		</ActionSection>
	);
}
