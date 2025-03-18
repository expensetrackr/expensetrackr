import { parseAsString, parseAsStringEnum, useQueryStates } from "nuqs";

export function useTransactionsParams() {
    const [params, setParams] = useQueryStates(
        {
            account_id: parseAsString,
            "filter[name]": parseAsString.withDefault("").withOptions({
                throttleMs: 1000,
            }),
            "filter[type]": parseAsStringEnum(["", "income", "expense"]).withDefault("").withOptions({
                throttleMs: 500,
            }),
            sort: parseAsStringEnum(["-dated_at", "dated_at"]),
        },
        {
            shallow: true,
            clearOnDefault: true,
        },
    );

    return {
        ...params,
        setParams,
    };
}
