import * as v from "valibot";

export const TransactionRecurringInterval = v.picklist(["daily", "weekly", "monthly", "quarterly", "yearly"]);
