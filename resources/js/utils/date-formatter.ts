import { format, isThisYear } from "date-fns";
import { es, enUS } from "date-fns/locale";

export function formatDate(date: Date | string, formatStr?: string, language = "en") {
    let formatString = formatStr ?? (isThisYear(date) ? "MMMM dd" : "MMMM dd, yyyy");

    let locale = enUS;
    switch (language) {
        case "es":
            locale = es;
            break;
    }
    return format(date, formatString, {
        locale,
    });
}
