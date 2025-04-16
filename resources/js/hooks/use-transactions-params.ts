import { parseAsString, parseAsStringEnum, parseAsStringLiteral, useQueryStates } from "nuqs";

export function useTransactionsParams() {
    const [params, setParams] = useQueryStates(
        {
            accountId: parseAsString,
            transactionId: parseAsString,
            query: parseAsString.withDefault(""),
            "filter[name]": parseAsString.withDefault("").withOptions({
                throttleMs: 1000,
            }),
            type: parseAsStringEnum(["", "income", "expense"]).withDefault("").withOptions({
                throttleMs: 500,
            }),
            sort: parseAsStringEnum(["", "dated_at"]).withDefault(""),
            sortDirection: parseAsStringEnum(["", "desc", "asc"]).withDefault(""),
            action: parseAsStringLiteral(["delete"]),
        },
        {
            shallow: true,
            clearOnDefault: true,
            urlKeys: {
                accountId: "account_id",
                transactionId: "transaction_id",
                type: "filters[type]",
                sort: "filters[sort]",
                sortDirection: "filters[sort_direction]",
                query: "q",
            },
        },
    );

    return {
        ...params,
        setParams,
    };
}
