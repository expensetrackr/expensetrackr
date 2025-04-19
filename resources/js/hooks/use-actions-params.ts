import { type Options, parseAsString, parseAsStringEnum, parseAsStringLiteral, useQueryStates } from "nuqs";

import { AccountTypeEnum } from "#/schemas/account.ts";

export function useActionsParams() {
    const [params, setParams] = useQueryStates(
        {
            action: parseAsStringLiteral(["create"]),
            resource: parseAsStringLiteral(["accounts"]),
            resourceId: parseAsString,
            accountType: parseAsStringEnum(AccountTypeEnum.options).withDefault("depository"),
        },
        {
            urlKeys: {
                accountType: "account_type",
                resourceId: "resource_id",
            },
        },
    );

    const resetParams = async (options?: Options) => {
        await setParams(
            {
                action: null,
                resource: null,
                accountType: null,
                resourceId: null,
            },
            options,
        );
    };

    return {
        ...params,
        setParams,
        resetParams,
    };
}
