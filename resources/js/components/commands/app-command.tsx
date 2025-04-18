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
import { PlaceholderLogo } from "../placeholder-logo.tsx";

export function AppCommandMenu() {
    const [isOpen, setOpen] = React.useState(false);
    const { setParams, ...params } = useAppCommandParams();

    useHotkeys("meta+k", () => setOpen(true));

    const goToPreviousStep = async () => {
        switch (params.page) {
            case "institution":
                await setParams({ page: "home" });
                break;
            default:
                break;
        }
    };

    const handleOpenChange = async (open: boolean) => {
        if (!open) {
            await setParams({ page: "home" });
        }

        setOpen(open);
    };

    return (
        <CommandMenu.Dialog
            className="max-h-[42vh] min-h-[42vh]"
            onOpenChange={handleOpenChange}
            open={isOpen}
            shouldFilter={params.page === "home"}
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
                        if (params.page === "home" || params.query.length) {
                            return;
                        }

                        if (e.key === "Backspace") {
                            e.preventDefault();
                            await goToPreviousStep();
                        }
                    }}
                    onValueChange={(query) => setParams({ query })}
                    placeholder="Search or jump to"
                    value={params.query}
                />
                <CompactButton.Root $size="md" $style="ghost" onClick={() => setOpen(false)}>
                    <CompactButton.Icon as={Cancel01Icon} />
                </CompactButton.Root>
            </div>

            <CommandMenu.List>
                {params.page === "home" && <Home />}
                {params.page === "institution" && <ChooseInstitution />}
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
                <CommandMenu.Item onSelect={() => setParams({ page: "institution" })}>
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
    const [debouncedSearchQuery] = useDebounceValue(params.query, 500);
    const query = useQuery<App.Data.Finance.InstitutionSearchData[]>({
        queryKey: ["institutions", debouncedSearchQuery],
        queryFn: async () => {
            const res = await fetch(routes.api.institutions.index({ query: { q: debouncedSearchQuery } }).url);
            return (await res.json()) as App.Data.Finance.InstitutionSearchData[];
        },
        enabled: params.page === "institution",
    });

    console.log(query.data);

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
                        {Array.from({ length: 10 }).map((_, index) => (
                            <div
                                aria-hidden="true"
                                className="h-9 animate-pulse rounded-10 bg-(--bg-weak-50)"
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
                                $size="20"
                                as={Avatar.Root}
                                className="!rounded-4 ring-1 ring-(--stroke-soft-200)"
                            >
                                <Avatar.Image $color="gray" asChild className="!rounded-4">
                                    <Image alt={institution.name} height={20} src={institution.logo} width={20} />
                                </Avatar.Image>
                            </CommandMenu.ItemIcon>
                        ) : (
                            <CommandMenu.ItemIcon
                                as={PlaceholderLogo}
                                className="rounded-4 bg-(--bg-weak-50) text-(--text-disabled-300) ring-1 ring-(--stroke-soft-200)"
                            />
                        )}
                        {institution.name}
                    </CommandMenu.Item>
                ))}
            </CommandMenu.Group>
        </>
    );
}
