import * as v from "valibot";

export const TransactionRecurringInterval = v.picklist(["daily", "weekly", "monthly", "quarterly", "yearly"]);

export const TransactionType = v.picklist([
    "expense",
    "income",
    // "transfer", TODO: enable this once we have a transfer feature
]);
