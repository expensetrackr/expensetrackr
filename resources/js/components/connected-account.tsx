import GoogleIcon from "virtual:icons/logos/google-icon";

type ConnectedAccountProps = {
    provider: App.Data.Socialstream.ProviderData;
    connectedAccount?: App.Data.Socialstream.ConnectedAccount;
    children?: React.ReactNode;
};

const providerIcons: Record<App.Enums.Shared.SocialstreamProvider, React.ReactNode> = {
    google: <GoogleIcon className="size-7" />,
};

export function ConnectedAccount({ connectedAccount, provider, children }: ConnectedAccountProps) {
    return (
        <div className="flex flex-col gap-1">
            <div className="flex flex-col gap-3.5 lg:flex-row lg:items-center">
                <div className="flex flex-1 items-center gap-3.5">
                    <div className="flex size-12 items-center justify-center rounded-full border border-(--stroke-soft-200) p-2">
                        {providerIcons[provider.id]}
                    </div>

                    <div className="flex flex-1 flex-col gap-1">
                        <h3 className="text-label-md">{provider.name}</h3>

                        {connectedAccount?.createdAt ? (
                            <p className="text-paragraph-sm text-(--text-sub-600)">
                                Connected {connectedAccount?.createdAt}
                            </p>
                        ) : (
                            <p className="text-paragraph-sm text-(--text-sub-600)">Not connected.</p>
                        )}
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">{children}</div>
            </div>
        </div>
    );
}
