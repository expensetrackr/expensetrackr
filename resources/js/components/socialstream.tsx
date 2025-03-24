import { Link } from "@inertiajs/react";
import GoogleIcon from "virtual:icons/logos/google-icon";

import * as Divider from "#/components/ui/divider.tsx";
import * as SocialButton from "#/components/ui/social-button.tsx";
import { useSocialstream } from "#/hooks/use-socialstream.ts";
import { useTranslation } from "#/hooks/use-translation.ts";

const socialsIcons = {
    google: GoogleIcon,
} satisfies Record<App.Enums.Socialstream.Provider, React.ForwardRefExoticComponent<React.SVGProps<SVGSVGElement>>>;

export function Socialstream() {
    const socialstream = useSocialstream();
    const { t } = useTranslation();

    return (
        <div className="mt-1 mb-2 flex flex-col gap-4">
            <Divider.Root $type="line-text" className="uppercase">
                {t("common.or")}
            </Divider.Root>

            <div className="flex flex-col gap-4 lg:flex-row">
                {socialstream.providers.map((provider) => {
                    return (
                        <SocialButton.Root
                            $brand={provider.id}
                            $style="stroke"
                            asChild
                            className="w-full"
                            key={provider.id}
                        >
                            <Link href={route("oauth.redirect", provider)}>
                                <SocialButton.Icon as={socialsIcons[provider.id]} />
                                {t("socialstream.continue_with", { provider: provider.name })}
                            </Link>
                        </SocialButton.Root>
                    );
                })}
            </div>
        </div>
    );
}
