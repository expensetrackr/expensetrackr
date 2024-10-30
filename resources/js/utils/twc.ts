import { createTwc } from "react-twc";
import { extendTailwindMerge } from "tailwind-merge";

export const twMerge = extendTailwindMerge({
    extend: {
        classGroups: {
            "font-size": [
                "text-h1",
                "text-h2",
                "text-h3",
                "text-h4",
                "text-h5",
                "text-h6",
                "text-label-xl",
                "text-label-lg",
                "text-label-md",
                "text-label-sm",
                "text-label-xs",
                "text-paragraph-xl",
                "text-paragraph-lg",
                "text-paragraph-md",
                "text-paragraph-sm",
                "text-paragraph-xs",
                "text-subheading-md",
                "text-subheading-sm",
                "text-subheading-xs",
                "text-subheading-2xs",
            ],
        },
    },
});

export const twc = createTwc({
    compose: twMerge,
});
