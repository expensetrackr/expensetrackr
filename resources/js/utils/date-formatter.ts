import { format, isThisYear } from "date-fns";

export function formatDate(date: Date | string) {
    let formatString = isThisYear(date) ? "MMMM dd" : "MMMM dd, yyyy";
    return format(date, formatString);
}
