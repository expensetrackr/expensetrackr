import { type LabelHTMLAttributes } from "react";

import { cx } from "#/utils/cva.ts";

export default function InputLabel({
    value,
    className,
    children,
    ...props
}: LabelHTMLAttributes<HTMLLabelElement> & { value?: string }) {
    return (
        <label
            {...props}
            className={cx(
                "flex items-center text-label-sm font-medium aria-disabled:text-(--text-disabled-300)",
                className,
            )}
        >
            {value ? value : children}
        </label>
    );
}
