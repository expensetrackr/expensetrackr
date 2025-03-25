import { parseAsString, parseAsStringLiteral, useQueryStates } from "nuqs";

export function useCategoriesParams() {
    const [params, setParams] = useQueryStates(
        {
            categoryId: parseAsString,
            "filter[name]": parseAsString.withDefault("").withOptions({
                throttleMs: 500,
            }),
            action: parseAsStringLiteral(["create", "delete"]),
        },
        {
            clearOnDefault: true,
            urlKeys: {
                categoryId: "category_id",
            },
        },
    );

    return {
        ...params,
        setParams,
    };
}
