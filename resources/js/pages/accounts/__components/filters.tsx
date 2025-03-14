import KeyCmd16Icon from "virtual:icons/qlementine-icons/key-cmd-16";
import Filter3FillIcon from "virtual:icons/ri/filter-3-fill";
import Search2Icon from "virtual:icons/ri/search-2-line";
import SortDescIcon from "virtual:icons/ri/sort-desc";

import { Select } from "#/components/form/select.tsx";
import { TextField } from "#/components/form/text-field.tsx";
import * as Button from "#/components/ui/button.tsx";
import * as Kbd from "#/components/ui/kbd.tsx";
import { useAccountParams } from "#/hooks/use-account-params.ts";

export function Filters() {
    const { setParams, ...params } = useAccountParams();

    const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
        await setParams({ "filter[name]": e.target.value });
    };

    return (
        <div className="flex flex-col justify-end gap-4 lg:flex-row lg:flex-wrap lg:items-center lg:gap-3">
            <TextField
                inlineTrailingNode={
                    <button type="button">
                        <Filter3FillIcon className="size-5 text-(--text-soft-400)" />
                    </button>
                }
                leadingIcon={Search2Icon}
                onChange={handleSearch}
                placeholder="Search..."
                value={params["filter[name]"] ?? ""}
                wrapperClassName="lg:hidden"
            />

            <div className="hidden flex-wrap gap-3 min-[560px]:flex-nowrap lg:flex">
                <TextField
                    $size="sm"
                    className="w-[300px]"
                    inlineTrailingNode={
                        <Kbd.Root>
                            <KeyCmd16Icon className="size-2.5" />1
                        </Kbd.Root>
                    }
                    leadingIcon={Search2Icon}
                    onChange={handleSearch}
                    placeholder="Search..."
                    value={params["filter[name]"] ?? ""}
                />

                <Button.Root $size="sm" $style="stroke" $type="neutral" className="flex-1 min-[560px]:flex-none">
                    <Button.Icon as={Filter3FillIcon} />
                    Filter
                </Button.Root>

                <Select
                    $size="sm"
                    onValueChange={(value) => setParams({ sort: value })}
                    options={[
                        {
                            value: "created_at",
                            label: "ASC",
                        },
                        {
                            value: "-created_at",
                            label: "DESC",
                        },
                    ]}
                    placeholder="Sort by"
                    triggerIcon={SortDescIcon}
                    value={params.sort || undefined}
                    wrapperClassName="w-auto flex-1 min-[560px]:flex-none"
                />
            </div>
        </div>
    );
}
