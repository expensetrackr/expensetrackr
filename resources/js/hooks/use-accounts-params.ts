import { parseAsString, parseAsStringEnum, parseAsStringLiteral, useQueryStates } from "nuqs";

export function useAccountsParams() {
    const [params, setParams] = useQueryStates(
        {
            accountId: parseAsString,
            "filter[name]": parseAsString.withDefault("").withOptions({
                throttleMs: 500,
            }),
            sort: parseAsStringEnum(["-created_at", "created_at"]),
            action: parseAsStringLiteral(["delete"]),
        },
        {
            clearOnDefault: true,
            urlKeys: {
                accountId: "account_id",
            },
        },
    );

    return {
        ...params,
        setParams,
    };
}
