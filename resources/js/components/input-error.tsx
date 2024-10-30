import { type HTMLAttributes } from "react";

import { cx } from "#/utils/cva.ts";

export default function InputError({
    message,
    className,
    ...props
}: HTMLAttributes<HTMLParagraphElement> & { message?: string }) {
    return message ? (
        <p {...props} className={cx("text-sm text-red-600", className)}>
            {message}
        </p>
    ) : null;
}
