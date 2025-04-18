import { useQuery } from "@tanstack/react-query";
import { Command } from "cmdk";
import * as React from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { useDebounceValue } from "usehooks-ts";
import ArrowLeftRightIcon from "virtual:icons/hugeicons/arrow-left-right";
import Cancel01Icon from "virtual:icons/hugeicons/cancel-01";
import ConnectIcon from "virtual:icons/hugeicons/connect";
import Search01Icon from "virtual:icons/hugeicons/search-01";

import * as Avatar from "#/components/ui/avatar.tsx";
import * as CommandMenu from "#/components/ui/command-menu.tsx";
import * as CompactButton from "#/components/ui/compact-button.tsx";
import { useAppCommandParams } from "#/hooks/use-app-command-params.ts";
import { useTranslation } from "#/hooks/use-translation.ts";
import { routes } from "#/routes.ts";
import { AccountTypeEnum } from "#/schemas/account.ts";
import { cn } from "#/utils/cn.ts";
import { accountTypeColors, AccountTypeIcon } from "../account-type-icon.tsx";
import { Image } from "../image.tsx";
import { InstitutionInfo } from "../institution-info.tsx";
import { PlaceholderLogo } from "../placeholder-logo.tsx";

export function AppCommandMenu() {
    const [isOpen, setOpen] = React.useState(false);
    const { setParams, ...params } = useAppCommandParams();

    useHotkeys("meta+k", () => setOpen(true));

    const goToPreviousStep = async () => {
        switch (params.commandPage) {
            case "institution":
                await setParams({ commandPage: "home" });
                break;
            default:
                break;
        }
    };

    const handleOpenChange = async (open: boolean) => {
        if (!open) {
            await setParams({ commandPage: "home" });
        }

        setOpen(open);
    };

    return (
        <CommandMenu.Dialog
            className="max-h-[64vh]"
            onOpenChange={handleOpenChange}
            open={isOpen}
            shouldFilter={params.commandPage === "home"}
        >
            {/* Input wrapper */}
            <div className="group/cmd-input flex h-12 w-full items-center gap-2 bg-(--bg-white-0) px-5">
                <Search01Icon
                    className={cn(
                        "size-5 shrink-0 text-(--text-soft-400)",
                        "transition duration-200 ease-out",
                        // focus within
                        "group-focus-within/cmd-input:text-primary",
                    )}
                />
                <CommandMenu.Input
                    onKeyDown={async (e) => {
                        if (params.commandPage === "home" || params.institutionQuery.length) {
                            return;
                        }

                        if (e.key === "Backspace") {
                            e.preventDefault();
                            await goToPreviousStep();
                        }
                    }}
                    onValueChange={(search) => setParams({ institutionQuery: search })}
                    placeholder="Search or jump to"
                    value={params.institutionQuery}
                />
                <CompactButton.Root $size="md" $style="ghost" onClick={() => setOpen(false)}>
                    <CompactButton.Icon as={Cancel01Icon} />
                </CompactButton.Root>
            </div>

            <CommandMenu.List>
                {params.commandPage === "home" && <Home />}
                {params.commandPage === "institution" && <ChooseInstitution />}
            </CommandMenu.List>
        </CommandMenu.Dialog>
    );
}

function Home() {
    const { setParams } = useAppCommandParams();
    const { t } = useTranslation();

    return (
        <>
            <CommandMenu.Group heading="Quick Actions">
                <CommandMenu.Item onSelect={() => setParams({ commandPage: "institution" })}>
                    <CommandMenu.ItemIcon as={ConnectIcon} />
                    Connect your bank account
                </CommandMenu.Item>
                <CommandMenu.Item>
                    <CommandMenu.ItemIcon as={ArrowLeftRightIcon} />
                    Create a transaction
                </CommandMenu.Item>
            </CommandMenu.Group>

            <CommandMenu.Group heading="Manually create an account">
                {AccountTypeEnum.options.map((option) => (
                    <CommandMenu.Item key={option}>
                        <CommandMenu.ItemIcon
                            accountType={option}
                            as={AccountTypeIcon}
                            className="text-(--color-account-type)"
                            style={{ "--color-account-type": accountTypeColors[option] }}
                        />
                        {t(`account.type.${option}`)}
                    </CommandMenu.Item>
                ))}
            </CommandMenu.Group>
        </>
    );
}

function ChooseInstitution() {
    const { setParams, ...params } = useAppCommandParams();
    const [debouncedSearchQuery] = useDebounceValue(params.institutionQuery, 500);
    const query = useQuery<App.Data.Finance.InstitutionSearchData[]>({
        queryKey: ["institutions", debouncedSearchQuery],
        queryFn: async () => {
            const res = await fetch(routes.api.institutions.index({ query: { q: debouncedSearchQuery } }).url);
            return (await res.json()) as App.Data.Finance.InstitutionSearchData[];
        },
        enabled: params.commandPage === "institution",
    });

    return (
        <>
            {!query.isLoading && !query.data?.length && (
                <Command.Empty className="px-5 py-4 text-center text-paragraph-sm text-(--text-sub-600)">
                    No results found.
                </Command.Empty>
            )}
            {query.isLoading ? (
                <Command.Loading>
                    <div className="flex flex-col gap-1 px-2 py-3">
                        {Array.from({ length: 15 }).map((_, index) => (
                            <div
                                aria-hidden="true"
                                className="h-10 animate-pulse rounded-10 bg-(--bg-weak-50)"
                                key={index}
                            />
                        ))}
                    </div>
                </Command.Loading>
            ) : null}

            <CommandMenu.Group>
                {query.data?.map((institution) => (
                    <CommandMenu.Item key={institution.id}>
                        {institution.logo ? (
                            <CommandMenu.ItemIcon
                                $size="24"
                                as={Avatar.Root}
                                className="size-7 !rounded-4 ring-1 ring-(--stroke-soft-200)"
                            >
                                <Avatar.Image $color="gray" asChild className="size-7 !rounded-4">
                                    <Image alt={institution.name} height={28} src={institution.logo} width={28} />
                                </Avatar.Image>
                            </CommandMenu.ItemIcon>
                        ) : (
                            <CommandMenu.ItemIcon
                                as={PlaceholderLogo}
                                className="size-7 rounded-4 bg-(--bg-weak-50) text-(--text-disabled-300) ring-1 ring-(--stroke-soft-200)"
                            />
                        )}
                        <div className="flex flex-1 items-center justify-between">
                            <p>{institution.name}</p>
                            <InstitutionInfo provider={institution.provider}>
                                <p className="inline-flex items-center gap-1 text-paragraph-xs text-(--text-sub-600)">
                                    <span>
                                        Via <span className="capitalize">{institution.provider}</span>
                                    </span>
                                    <Image
                                        alt={institution.provider}
                                        className="size-4 rounded-4"
                                        height={16}
                                        isCdn
                                        src={`/major-brands/${institution.provider}.png`}
                                        width={16}
                                    />
                                </p>
                            </InstitutionInfo>
                        </div>
                    </CommandMenu.Item>
                ))}
            </CommandMenu.Group>
        </>
    );
}
