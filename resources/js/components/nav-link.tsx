import { type InertiaLinkProps, Link } from "@inertiajs/react";

import { cx } from "#/utils/cva.ts";

export default function NavLink({
    active = false,
    className,
    children,
    ...props
}: InertiaLinkProps & { active: boolean }) {
    return (
        <Link
            {...props}
            className={cx(
                "text-sm inline-flex items-center border-b-2 px-1 pt-1 leading-5 font-medium transition duration-150 ease-in-out focus:outline-none",
                active
                    ? "border-indigo-400 text-gray-900 focus:border-indigo-700"
                    : "text-gray-500 hover:border-gray-300 hover:text-gray-700 focus:border-gray-300 focus:text-gray-700 border-transparent",
                className,
            )}
        >
            {children}
        </Link>
    );
}
