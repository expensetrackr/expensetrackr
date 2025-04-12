import { parseAsStringEnum, useQueryStates } from "nuqs";

import { AccountTypeEnum, ConnectionTypeEnum } from "#/schemas/account.ts";

export function useCreateAccountParams() {
    const [params, setParams] = useQueryStates(
        {
            type: parseAsStringEnum(AccountTypeEnum.options),
            connectionType: parseAsStringEnum(ConnectionTypeEnum.options),
        },
        {
            urlKeys: {
                connectionType: "connection_type",
            },
        },
    );

    return { ...params, setParams };
}
