import * as ScrollAreaPrimitives from "@radix-ui/react-scroll-area";
import { Image } from "@unpic/react";
import { useQueryState } from "nuqs";
import KeyCmd16Icon from "virtual:icons/qlementine-icons/key-cmd-16";
import Search2Icon from "virtual:icons/ri/search-2-line";

import { InstitutionInfo } from "../institution-info.tsx";
import { PlaceholderLogo } from "../placeholder-logo.tsx";
import * as Avatar from "../ui/avatar.tsx";
import * as Button from "../ui/button.tsx";
import * as Divider from "../ui/divider.tsx";
import * as Input from "../ui/input.tsx";
import * as Kbd from "../ui/kbd.tsx";
import * as Label from "../ui/label.tsx";

type BankSelectionProps = {
    institutions: Array<App.Data.SearchableInstitutionData>;
};

export function BankSelection({ institutions }: BankSelectionProps) {
    const [search, setSearch] = useQueryState("q", { defaultValue: "", throttleMs: 500 });

    return (
        <div className="flex shrink-0 flex-col gap-3">
            <div className="flex flex-col gap-1">
                <Label.Root htmlFor="search">Choose a bank</Label.Root>
                <Input.Root $size="md">
                    <Input.Wrapper>
                        <Input.Icon as={Search2Icon} />
                        <Input.Input
                            id="search"
                            inputMode="search"
                            name="search"
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search for a bank..."
                            value={search}
                        />
                        <Kbd.Root>
                            <KeyCmd16Icon className="size-4" />1
                        </Kbd.Root>
                    </Input.Wrapper>
                </Input.Root>
            </div>

            <div className="flex flex-col gap-1 rounded-20 bg-(--bg-white-0) p-2 pt-3 shadow-xs ring-1 ring-(--stroke-soft-200) ring-inset">
                <Divider.Root $type="text">Available banks</Divider.Root>

                <ScrollAreaPrimitives.Root type="auto">
                    <ScrollAreaPrimitives.Viewport
                        className="max-h-112 w-full scroll-py-2 overflow-auto p-2"
                        style={{ overflowY: undefined }}
                    >
                        {institutions.map((institution) => (
                            <SearchResult key={institution.id} {...institution} />
                        ))}
                    </ScrollAreaPrimitives.Viewport>
                    <ScrollAreaPrimitives.Scrollbar orientation="vertical">
                        <ScrollAreaPrimitives.Thumb className="!w-1 rounded-4 bg-(--bg-soft-200)" />
                    </ScrollAreaPrimitives.Scrollbar>
                </ScrollAreaPrimitives.Root>
            </div>
        </div>
    );
}

type SearchResultProps = {
    id: string;
    name: string;
    logo: string | null;
    provider: string;
};

function SearchResult({ name, logo, provider }: SearchResultProps) {
    return (
        <div className="flex items-center gap-3 p-2">
            {logo ? (
                <Avatar.Root $size="40" className="!rounded-8 ring-1 ring-(--stroke-soft-200)">
                    <Avatar.Image $color="gray" asChild className="size-10 !rounded-8">
                        <Image alt={name} height={40} src={logo} width={40} />
                    </Avatar.Image>
                </Avatar.Root>
            ) : (
                <PlaceholderLogo className="rounded-8 bg-(--bg-weak-50) text-(--text-disabled-300) ring-1 ring-(--stroke-soft-200)" />
            )}
            <div className="flex-1">
                <div className="text-label-sm text-(--text-strong-950)">{name}</div>
                <InstitutionInfo provider={provider}>
                    <div className="mt-1 inline-flex items-center gap-1 text-paragraph-xs text-(--text-sub-600)">
                        <span>
                            Via <span className="capitalize">{provider}</span>
                        </span>
                        <Image
                            alt={provider}
                            className="size-4 rounded-full"
                            height={16}
                            src={`${ENV.PUBLIC_ASSETS_URL}/major-brands/${provider}`}
                            width={16}
                        />
                    </div>
                </InstitutionInfo>
            </div>
            <Button.Root $size="xs" $style="stroke" $type="neutral">
                Connect
            </Button.Root>
        </div>
    );
}
