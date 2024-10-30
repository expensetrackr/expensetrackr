import GoogleIcon from "virtual:icons/logos/google-icon";

import type { ConnectedAccountType, Provider } from "#/types/index.d.ts";

type ConnectedAccountProps = {
	provider: Provider;
	connectedAccount?: ConnectedAccountType;
	children?: React.ReactNode;
};

const providerIcons = {
	google: <GoogleIcon className="size-7" />,
};

export function ConnectedAccount({ connectedAccount, provider, children }: ConnectedAccountProps) {
	return (
		<div className="flex flex-col gap-1 py-5">
			<div className="flex flex-col gap-3.5 lg:flex-row lg:items-center">
				<div className="flex flex-1 items-center gap-3.5">
					<div className="flex size-12 items-center justify-center rounded-full border border-[var(--stroke-soft-200)] p-2">
						{providerIcons[provider.id]}
					</div>

					<div className="flex flex-1 flex-col gap-1">
						<h3 className="text-label-md">{provider.name}</h3>

						{connectedAccount?.created_at ? (
							<p className="text-[var(--text-sub-600)] text-paragraph-sm">Connected {connectedAccount?.created_at}</p>
						) : (
							<p className="text-[var(--text-sub-600)] text-paragraph-sm">Not connected.</p>
						)}
					</div>
				</div>

				<div className="flex flex-wrap items-center gap-2">{children}</div>
			</div>
		</div>
	);
}
