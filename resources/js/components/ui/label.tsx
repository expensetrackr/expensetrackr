import { Label as LabelPrimitives } from "radix-ui";

import { twc } from "#/utils/twc.ts";

export const Root = twc(LabelPrimitives.Root).attrs<
    React.ComponentPropsWithoutRef<typeof LabelPrimitives.Root> & {
        disabled?: boolean;
    }
>((props) => ({
    "aria-disabled": props.disabled,
}))`group cursor-pointer text-label-sm flex items-center gap-px aria-disabled:text-(--text-disabled-300)`;

export const Asterisk = twc.span.attrs({
    children: "*",
})`text-primary group-aria-disabled:text-(--text-disabled-300)`;

export const Sub = twc.span`text-paragraph-sm text-(--text-sub-600) group-aria-disabled:text-(--text-disabled-300)`;
