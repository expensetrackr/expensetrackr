import { parseAsString, useQueryStates, parseAsStringEnum } from "nuqs";

import { bankAccountProvider } from "#/schemas/bank-account";

export function useConnectParams(initialCountryCode?: string) {
    const [params, setParams] = useQueryStates({
        step: parseAsStringEnum(["institution-selection", "bank-accounts-selection"]).withDefault(
            "institution-selection",
        ),
        countryCode: parseAsString.withDefault(initialCountryCode ?? ""),
        provider: parseAsStringEnum(bankAccountProvider.options),
        token: parseAsString,
        enrollment_id: parseAsString,
        institution_id: parseAsString,
        q: parseAsString.withDefault("").withOptions({ clearOnDefault: true }),
        error: parseAsString,
        ref: parseAsString,
        details: parseAsString,
    });

    return {
        ...params,
        setParams,
    };
}
