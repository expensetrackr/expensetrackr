import CommandIcon from "virtual:icons/hugeicons/command";
import Search01Icon from "virtual:icons/hugeicons/search-01";
import Sorting01Icon from "virtual:icons/hugeicons/sorting-01";

import { SelectField } from "#/components/form/select-field.tsx";
import { TextField } from "#/components/form/text-field.tsx";
import * as Kbd from "#/components/ui/kbd.tsx";
import * as SegmentedControl from "#/components/ui/segmented-control.tsx";
import { useTransactionsParams } from "#/hooks/use-transactions-params.ts";

export function TransactionsFilters() {
    const { setParams, ...params } = useTransactionsParams();

    const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
        await setParams({ query: e.target.value });
    };

    return (
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:flex-wrap lg:items-center lg:gap-3">
            <TextField
                leadingIcon={Search01Icon}
                onChange={handleSearch}
                placeholder="Search..."
                value={params.query}
                wrapperClassName="lg:hidden"
            />

            <SegmentedControl.Root
                className="lg:w-80"
                onValueChange={(v) => setParams({ type: v as NonNullable<(typeof params)["type"]> })}
                value={params.type}
            >
                <SegmentedControl.List>
                    <SegmentedControl.Trigger value="">All</SegmentedControl.Trigger>
                    <SegmentedControl.Trigger value="income">Income</SegmentedControl.Trigger>
                    <SegmentedControl.Trigger value="expense">Expenses</SegmentedControl.Trigger>
                </SegmentedControl.List>
            </SegmentedControl.Root>

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
                    value={params.query}
                />

                <SelectField
                    $size="sm"
                    onValueChange={(value) =>
                        setParams({
                            sort: "dated_at",
                            sortDirection: value as NonNullable<(typeof params)["sortDirection"]>,
                        })
                    }
                    options={[
                        {
                            value: "asc",
                            label: "ASC",
                        },
                        {
                            value: "desc",
                            label: "DESC",
                        },
                    ]}
                    placeholder="Sort by"
                    triggerIcon={Sorting01Icon}
                    value={params.sortDirection || undefined}
                    wrapperClassName="w-auto flex-1 min-[560px]:flex-none"
                />
            </div>
        </div>
    );
}
