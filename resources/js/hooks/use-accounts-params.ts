import { parseAsString, parseAsStringEnum, parseAsStringLiteral, useQueryStates } from "nuqs";

export function useAccountsParams() {
    const [params, setParams] = useQueryStates(
        {
            "filter[name]": parseAsString.withDefault("").withOptions({
                throttleMs: 500,
            }),
            sort: parseAsStringEnum(["-created_at", "created_at"]),
            action: parseAsStringLiteral(["delete"]),
        },
        {
            clearOnDefault: true,
        },
    );

    return {
        ...params,
        setParams,
    };
}
