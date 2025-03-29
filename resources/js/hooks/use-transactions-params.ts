import { parseAsString, parseAsStringEnum, parseAsStringLiteral, useQueryStates } from "nuqs";

export function useTransactionsParams() {
    const [params, setParams] = useQueryStates(
        {
            accountId: parseAsString,
            transactionId: parseAsString,
            "filter[name]": parseAsString.withDefault("").withOptions({
                throttleMs: 1000,
            }),
            "filter[type]": parseAsStringEnum(["", "income", "expense"]).withDefault("").withOptions({
                throttleMs: 500,
            }),
            sort: parseAsStringEnum(["-dated_at", "dated_at"]),
            action: parseAsStringLiteral(["delete"]),
        },
        {
            shallow: true,
            clearOnDefault: true,
            urlKeys: {
                accountId: "account_id",
                transactionId: "transaction_id",
            },
        },
    );

    return {
        ...params,
        setParams,
    };
}
