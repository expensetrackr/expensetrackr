import { useQueryStates } from "nuqs";

export function useManualAccountParams() {
    const [params, setParams] = useQueryStates({});

    return { ...params, setParams };
}
