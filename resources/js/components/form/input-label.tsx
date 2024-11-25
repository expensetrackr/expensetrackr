import { type LabelHTMLAttributes } from "react";

import { cx } from "#/utils/cva.ts";

export default function InputLabel({
    value,
    className,
    children,
    ...props
}: LabelHTMLAttributes<HTMLLabelElement> & { value?: string }) {
    return (
        // biome-ignore lint/a11y/noLabelWithoutControl: it's already handled by the input component
        <label {...props} className={cx("text-sm text-gray-700 block font-medium", className)}>
            {value ? value : children}
        </label>
    );
}
