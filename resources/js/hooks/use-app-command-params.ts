import { parseAsString, parseAsStringLiteral, useQueryStates } from "nuqs";

export function useAppCommandParams() {
    const [params, setParams] = useQueryStates(
        {
            page: parseAsStringLiteral(["home", "institution"]).withDefault("home"),
            query: parseAsString.withDefault("").withOptions({
                throttleMs: 500,
            }),
        },
        {
            clearOnDefault: true,
            urlKeys: {
                query: "q",
            },
        },
    );

    return {
        ...params,
        setParams,
    };
}
