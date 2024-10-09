import type { HTMLAttributes } from "react";

import { cx } from "#/utils/cva";

export default function InputError({
	message,
	className,
	...props
}: HTMLAttributes<HTMLParagraphElement> & { message?: string }) {
	return message ? (
		<p {...props} className={cx("text-red-600 text-sm", className)}>
			{message}
		</p>
	) : null;
}
