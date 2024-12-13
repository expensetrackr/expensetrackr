import { Link, usePage } from "@inertiajs/react";
import GoogleIcon from "virtual:icons/flat-color-icons/google";

import * as Divider from "#/components/ui/divider.tsx";
import * as SocialButton from "#/components/ui/social-button.tsx";
import { type InertiaSharedProps, type ProviderType } from "#/types/index.ts";

const socialsIcons = {
    google: GoogleIcon,
} satisfies Record<ProviderType, React.ForwardRefExoticComponent<React.SVGProps<SVGSVGElement>>>;

export function Socialstream() {
    const page = usePage<InertiaSharedProps>();

    return (
        <div className="mt-1 mb-2 flex flex-col gap-4">
            <Divider.Root $type="line-text">OR</Divider.Root>

            <div className="flex flex-col gap-4 lg:flex-row">
                {page.props.socialstream.providers.map((provider) => {
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
                                Continue with {provider.name}
                            </Link>
                        </SocialButton.Root>
                    );
                })}
            </div>
        </div>
    );
}
