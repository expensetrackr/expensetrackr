import { parseAsString, parseAsStringEnum, useQueryStates } from "nuqs";

export function useAccountParams() {
    const [params, setParams] = useQueryStates(
        {
            accountId: parseAsString,
            "filter[name]": parseAsString.withDefault("").withOptions({
                throttleMs: 500,
            }),
            sort: parseAsStringEnum(["-created_at", "created_at"]),
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
