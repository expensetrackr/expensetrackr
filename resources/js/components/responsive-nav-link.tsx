import { type InertiaLinkProps, Link } from "@inertiajs/react";

import { cx } from "#/utils/cva";

export default function ResponsiveNavLink({
	active = false,
	className,
	children,
	...props
}: InertiaLinkProps & { active?: boolean }) {
	return (
		<Link
			{...props}
			className={cx(
				"flex w-full items-start border-l-4 py-2 ps-3 pe-4 font-medium text-base transition duration-150 ease-in-out focus:outline-none",
				active
					? "border-indigo-400 bg-indigo-50 text-indigo-700 focus:border-indigo-700 focus:bg-indigo-100 focus:text-indigo-800"
					: "border-transparent text-gray-600 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-800 focus:border-gray-300 focus:bg-gray-50 focus:text-gray-800",
				className,
			)}
		>
			{children}
		</Link>
	);
}
