import GoogleIcon from "virtual:icons/flat-color-icons/google";
import { usePage } from "@inertiajs/react";

import type { InertiaSharedProps, ProviderType } from "#/types/index.d.ts";

const socialsIcons = {
	google: <GoogleIcon className="size-5" />,
} satisfies Record<ProviderType, React.ReactElement>;

export function Socialstream() {
	const page = usePage<InertiaSharedProps>();

	return (
		<div className="mt-1 mb-2 flex flex-col gap-4">
			<div className="flex h-3 flex-row items-center gap-2.5 self-stretch whitespace-nowrap text-[var(--text-soft-400)] text-subheading-2xs uppercase before:h-px before:w-full before:flex-grow before:bg-[var(--stroke-soft-200)] after:h-px after:w-full after:flex-grow after:bg-[var(--stroke-soft-200)]">
				Or
			</div>

			<div className="flex flex-col gap-4 lg:flex-row">
				{page.props.socialstream.providers.map((provider) => {
					return (
						<a
							className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-10 border border-[var(--stroke-soft-200)] bg-[var(--bg-white-0)] p-2.5 text-label-sm outline-none ring-neutral-alpha-10 transition hover:border-[var(--bg-weak-50)] hover:bg-[var(--bg-weak-50)] focus-visible:border-[var(--stroke-strong-950)] focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-white-0)]"
							key={provider.id}
							href={route("oauth.redirect", provider)}
						>
							{socialsIcons[provider.id]}
							Continue with {provider.name}
						</a>
					);
				})}
			</div>
		</div>
	);
}
