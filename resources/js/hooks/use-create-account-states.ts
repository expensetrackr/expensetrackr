import { parseAsStringEnum, useQueryStates } from "nuqs";

import { accountTypeEnum, connectionTypeEnum } from "#/schemas/account.ts";

export function useCreateAccountStates() {
    const [state, setState] = useQueryStates({
        type: parseAsStringEnum(accountTypeEnum.options),
        connection_type: parseAsStringEnum(connectionTypeEnum.options),
    });

    return { state, setState };
}
