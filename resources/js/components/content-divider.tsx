import { type VariantProps } from "cva";

import { cva } from "#/utils/cva.ts";

const contentDividerVariants = cva({
    base: "text-(--text-soft-400) uppercase",
    variants: {
        $type: {
            text: "px-2 py-1 text-subheading-xs",
            "solid-text": "bg-(--bg-weak-50) px-4 py-1.5 text-subheading-xs",
        },
    },

    defaultVariants: {
        $type: "text",
    },
});

export interface ContentDividerProps
    extends React.HTMLAttributes<HTMLDivElement>,
        VariantProps<typeof contentDividerVariants> {}

export function ContentDivider({ $type = "text", className, children, ...props }: ContentDividerProps) {
    if ($type === "text" || $type === "solid-text") {
        return (
            <div
                {...props}
                aria-orientation="horizontal"
                className={contentDividerVariants({ $type, className })}
                role="separator"
            >
                <span>{children}</span>
            </div>
        );
    }

    return null;
}
