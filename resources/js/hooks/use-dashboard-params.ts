import { parseAsStringLiteral, useQueryStates } from "nuqs";

export const totalBalancePeriods = ["last-month", "last-6-months", "last-year"];

export function useDashboardParams() {
    const [params, setParams] = useQueryStates(
        {
            totalBalancePeriod: parseAsStringLiteral(totalBalancePeriods).withDefault("last-month"),
            spendingByCategoryPeriod: parseAsStringLiteral(totalBalancePeriods).withDefault("last-month"),
        },
        {
            urlKeys: {
                totalBalancePeriod: "total_balance[period]",
                spendingByCategoryPeriod: "spending_by_category[period]",
            },
        },
    );

    return {
        ...params,
        setParams,
    };
}
