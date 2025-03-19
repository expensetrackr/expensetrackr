import CommandIcon from "virtual:icons/hugeicons/command";
import Search01Icon from "virtual:icons/hugeicons/search-01";
import Sorting01Icon from "virtual:icons/hugeicons/sorting-01";

import { Select } from "#/components/form/select.tsx";
import { TextField } from "#/components/form/text-field.tsx";
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
                leadingIcon={Search01Icon}
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
                            <CommandIcon className="size-2.5" />1
                        </Kbd.Root>
                    }
                    leadingIcon={Search01Icon}
                    onChange={handleSearch}
                    placeholder="Search..."
                    value={params["filter[name]"] ?? ""}
                />

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
                    triggerIcon={Sorting01Icon}
                    value={params.sort || undefined}
                    wrapperClassName="w-auto flex-1 min-[560px]:flex-none"
                />
            </div>
        </div>
    );
}
