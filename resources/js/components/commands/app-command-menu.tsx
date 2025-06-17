import { useQuery } from "@tanstack/react-query";
import { Command } from "cmdk";
import { useHotkeys } from "react-hotkeys-hook";
import { useDebounceValue } from "usehooks-ts";
import ArrowLeftRightIcon from "virtual:icons/hugeicons/arrow-left-right";
import Cancel01Icon from "virtual:icons/hugeicons/cancel-01";
import ConnectIcon from "virtual:icons/hugeicons/connect";
import LicenseDraftIcon from "virtual:icons/hugeicons/license-draft";
import Search01Icon from "virtual:icons/hugeicons/search-01";
import ArrowNarrowDownLineIcon from "virtual:icons/untitled/arrow-narrow-down-line";
import ArrowNarrowUpLineIcon from "virtual:icons/untitled/arrow-narrow-up-line";
import CornerDownLeftLineIcon from "virtual:icons/untitled/corner-down-left-line";

import * as Avatar from "#/components/ui/avatar.tsx";
import * as CommandMenu from "#/components/ui/command-menu.tsx";
import * as CompactButton from "#/components/ui/compact-button.tsx";
import { useActionsParams } from "#/hooks/use-actions-params.ts";
import { useBankProvider } from "#/hooks/use-bank-provider.ts";
import { useCommandMenuParams } from "#/hooks/use-command-menu-params.ts";
import { useFeaturesAndPermissions } from "#/hooks/use-features-and-permissions.ts";
import { useTranslation } from "#/hooks/use-translation.ts";
import { useUser } from "#/hooks/use-user.ts";
import { routes } from "#/routes.ts";
import { AccountTypeEnum } from "#/schemas/account.ts";
import { useCommandMenuStore } from "#/store/command-menu.ts";
import { cn } from "#/utils/cn.ts";
import { accountTypeColors, AccountTypeIcon } from "../account-type-icon.tsx";
import { Image } from "../image.tsx";
import { InstitutionInfo } from "../institution-info.tsx";
import { PlaceholderLogo } from "../placeholder-logo.tsx";

export function AppCommandMenu() {
    const { isOpen, setOpen } = useCommandMenuStore();
    const { setParams, ...params } = useCommandMenuParams();

    useHotkeys(["ctrl+k", "meta+k"], () => setOpen(true));

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
            <CommandMenu.DialogTitle className="sr-only">Command Menu</CommandMenu.DialogTitle>
            <CommandMenu.DialogDescription className="sr-only">
                Use the command menu to navigate through ExpenseTrackr.
            </CommandMenu.DialogDescription>

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

            <CommandMenu.Footer>
                <div className="flex gap-3">
                    <div className="flex items-center gap-2">
                        <CommandMenu.FooterKeyBox>
                            <ArrowNarrowUpLineIcon className="size-4" />
                        </CommandMenu.FooterKeyBox>
                        <CommandMenu.FooterKeyBox>
                            <ArrowNarrowDownLineIcon className="size-4" />
                        </CommandMenu.FooterKeyBox>
                        <span className="text-paragraph-xs text-(--text-sub-600)">Navigate</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <CommandMenu.FooterKeyBox>
                            <CornerDownLeftLineIcon className="size-4" />
                        </CommandMenu.FooterKeyBox>
                        <span className="text-paragraph-xs text-(--text-sub-600)">Select</span>
                    </div>
                </div>
            </CommandMenu.Footer>
        </CommandMenu.Dialog>
    );
}

function Home() {
    const { setParams } = useCommandMenuParams();
    const actions = useActionsParams();
    const { toggleOpen } = useCommandMenuStore();
    const { t } = useTranslation();
    const user = useUser();
    const { permissions } = useFeaturesAndPermissions();

    const handleSelectAction = async (action: string, resource: string, params?: Record<string, string>) => {
        await actions.setParams({ action, resource, ...params });
        toggleOpen();
    };

    return (
        <>
            <CommandMenu.Group heading="Quick Actions">
                {user?.isSubscribed && (
                    <CommandMenu.Item onSelect={() => setParams({ commandPage: "institution" })}>
                        <CommandMenu.ItemIcon as={ConnectIcon} />
                        Connect your bank account
                    </CommandMenu.Item>
                )}
                {permissions.canCreateAccounts && (
                    <CommandMenu.Item onSelect={() => handleSelectAction("create", "accounts")}>
                        <CommandMenu.ItemIcon as={LicenseDraftIcon} />
                        Create a new account
                    </CommandMenu.Item>
                )}
                {permissions.canCreateTransactions && (
                    <CommandMenu.Item onSelect={() => handleSelectAction("create", "transactions")}>
                        <CommandMenu.ItemIcon as={ArrowLeftRightIcon} />
                        Create a transaction
                    </CommandMenu.Item>
                )}
            </CommandMenu.Group>

            {permissions.canCreateAccounts && (
                <CommandMenu.Group heading="Manually create an account">
                    {AccountTypeEnum.options.map((option) => (
                        <CommandMenu.Item
                            key={option}
                            onSelect={async () => handleSelectAction("create", "accounts", { accountType: option })}
                        >
                            <CommandMenu.ItemIcon
                                accountType={option}
                                as={AccountTypeIcon}
                                className="text-(--color-account-type)"
                                style={{ "--color-account-type": accountTypeColors[option] }}
                            />
                            {t(`accounts.type.${option}`)}
                        </CommandMenu.Item>
                    ))}
                </CommandMenu.Group>
            )}
        </>
    );
}

function ChooseInstitution() {
    const { setParams, ...params } = useCommandMenuParams();
    const [debouncedSearchQuery] = useDebounceValue(params.institutionQuery, 500);
    const query = useQuery<App.Data.Finance.InstitutionSearchData[]>({
        queryKey: ["institutions", debouncedSearchQuery],
        queryFn: async () => {
            const res = await fetch(routes.api.finance.institutions.index({ query: { q: debouncedSearchQuery } }).url);
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
                {query.data?.map((institution) => <InstitutionItem institution={institution} key={institution.id} />)}
            </CommandMenu.Group>
        </>
    );
}

function InstitutionItem({ institution }: { institution: App.Data.Finance.InstitutionSearchData }) {
    const { setInstitution } = useBankProvider({
        id: institution.id,
        name: institution.name,
        provider: institution.provider,
    });
    const { setOpen } = useCommandMenuStore();

    const handleSelect = async () => {
        setOpen(false);

        try {
            await fetch(`/api/institutions/${institution.id}/track-usage`, {
                method: "POST",
            });
        } catch (error) {
            // Don't let tracking failures break the user flow
            console.warn("Failed to track institution usage:", error);
        }

        await setInstitution(institution.id);
    };

    return (
        <CommandMenu.Item key={institution.id} onSelect={handleSelect}>
            {institution.logo ? (
                <CommandMenu.ItemIcon
                    $size="24"
                    as={Avatar.Root}
                    className="size-7 !rounded-4 ring-1 ring-(--stroke-soft-200)"
                >
                    <Avatar.Image $color="gray" asChild className="size-7 !rounded-4">
                        <Image alt={institution.name} height={28} isCdn src={institution.logo} width={28} />
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
    );
}
