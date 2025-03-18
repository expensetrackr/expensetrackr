import { parseAsIndex, parseAsInteger, useQueryStates } from "nuqs";

const paginationParsers = {
    pageIndex: parseAsIndex.withDefault(1),
    pageSize: parseAsInteger.withDefault(10),
};

const paginationUrlKeys = {
    pageIndex: "page",
    pageSize: "per_page",
};

export function usePaginationParams() {
    return useQueryStates(paginationParsers, {
        urlKeys: paginationUrlKeys,
    });
}
