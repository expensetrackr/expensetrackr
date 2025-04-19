import { parseAsString, useQueryStates, parseAsStringEnum } from "nuqs";

import { BankConnectionProviderSchema } from "#/schemas/bank-connection.ts";

export function useConnectParams(initialCountryCode?: string) {
    const [params, setParams] = useQueryStates(
        {
            countryCode: parseAsString.withDefault(initialCountryCode ?? ""),
            provider: parseAsStringEnum(BankConnectionProviderSchema.options),
            token: parseAsString,
            enrollmentId: parseAsString,
            institutionId: parseAsString,
            error: parseAsString,
            ref: parseAsString,
            details: parseAsString,
        },
        {
            urlKeys: {
                enrollmentId: "enrollment_id",
                institutionId: "institution_id",
            },
        },
    );

    return {
        ...params,
        setParams,
    };
}
