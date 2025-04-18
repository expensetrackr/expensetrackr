import { parseAsString, useQueryStates, parseAsStringEnum } from "nuqs";

import { BankConnectionProviderSchema } from "#/schemas/bank-connection.ts";

export function useConnectParams(initialCountryCode?: string) {
    const [params, setParams] = useQueryStates({
        countryCode: parseAsString.withDefault(initialCountryCode ?? ""),
        provider: parseAsStringEnum(BankConnectionProviderSchema.options),
        token: parseAsString,
        enrollment_id: parseAsString,
        institution_id: parseAsString,
        error: parseAsString,
        ref: parseAsString,
        details: parseAsString,
    });

    return {
        ...params,
        setParams,
    };
}
