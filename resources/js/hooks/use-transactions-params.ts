import { parseAsString, parseAsStringEnum, useQueryStates } from "nuqs";

export function useTransactionsParams() {
    const [params, setParams] = useQueryStates(
        {
            accountId: parseAsString,
            name: parseAsString.withDefault("").withOptions({
                throttleMs: 500,
            }),
            type: parseAsStringEnum(["", "income", "expense"]).withDefault("").withOptions({
                throttleMs: 500,
            }),
            sort: parseAsStringEnum(["dated_at", "-dated_at"]).withDefault("-dated_at"),
        },
        {
            shallow: true,
            clearOnDefault: true,
            urlKeys: {
                accountId: "filter[account_id]",
                name: "filter[name]",
                type: "filter[type]",
            },
        },
    );

    return {
        ...params,
        setParams,
    };
}
