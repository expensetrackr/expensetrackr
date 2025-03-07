import { parseAsStringEnum, useQueryStates } from "nuqs";

import { AccountTypeEnum, ConnectionTypeEnum } from "#/schemas/account.ts";

export function useCreateAccountParams() {
    const [params, setParams] = useQueryStates({
        type: parseAsStringEnum(AccountTypeEnum.options),
        connection_type: parseAsStringEnum(ConnectionTypeEnum.options),
    });

    return { ...params, setParams };
}
