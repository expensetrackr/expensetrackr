import { parseAsString, parseAsStringLiteral, useQueryStates } from "nuqs";

export function useAppCommandParams() {
    const [params, setParams] = useQueryStates(
        {
            commandPage: parseAsStringLiteral(["home", "institution"]).withDefault("home"),
            institutionQuery: parseAsString.withDefault("").withOptions({
                throttleMs: 500,
            }),
        },
        {
            clearOnDefault: true,
            urlKeys: {
                commandPage: "command_page",
                institutionQuery: "institution[q]",
            },
        },
    );

    return {
        ...params,
        setParams,
    };
}
