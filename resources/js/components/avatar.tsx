import * as Headless from "@headlessui/react";
import { type VariantProps } from "cva";

import { type Nullable, type User } from "#/types/index.ts";
import { cva, cx } from "#/utils/cva.ts";
import { TouchTarget } from "./button.tsx";
import { Link } from "./link.tsx";

const avatarVariants = cva({
    base: [
        // Basic layout
        "inline-grid shrink-0 align-middle [--avatar-radius:20%] [--ring-opacity:20%] *:col-start-1 *:row-start-1",
    ],
    variants: {
        $square: {
            true: "rounded-(--avatar-radius) *:rounded-(--avatar-radius)",
            false: "rounded-full *:rounded-full",
        },
    },
});

type BaseAvatarProps = {
    src?: string | null;
    initials?: string;
    alt?: string;
    className?: string;
    imageProps?: React.ComponentPropsWithoutRef<"img">;
    user?: Nullable<User>;
};

type AvatarProps = React.ComponentPropsWithoutRef<"span"> & VariantProps<typeof avatarVariants> & BaseAvatarProps;

export function Avatar({
    $square = false,
    src = null,
    user,
    initials = user?.name
        ?.split(" ")
        ?.map((word) => word.charAt(0))
        .join("") || user?.name?.charAt(0),
    alt = "",
    className,
    imageProps,
    ...props
}: AvatarProps) {
    return (
        <span
            data-slot="avatar"
            {...props}
            className={avatarVariants({
                $square,
                className,
            })}
        >
            {initials && (
                // biome-ignore lint/a11y/noSvgWithoutTitle: it has a title when alt is provided, if not, have aria-hidden
                <svg
                    aria-hidden={alt ? undefined : "true"}
                    className="bg-blue-200 fill-blue-950 text-label-md uppercase select-none"
                    viewBox="0 0 100 100"
                >
                    {alt && <title>{alt}</title>}
                    <text
                        alignmentBaseline="middle"
                        className="text-[48px]/[24px]"
                        dominantBaseline="middle"
                        dy=".075em"
                        textAnchor="middle"
                        x="50%"
                        y="50%"
                    >
                        {initials}
                    </text>
                </svg>
            )}
            {src && (
                <img
                    {...imageProps}
                    alt={alt}
                    className={cx(imageProps?.className, "!min-w-full rounded-full")}
                    src={src}
                />
            )}
        </span>
    );
}

const avatarButtonVariants = cva({
    base: "relative focus:outline-none data-focus:outline-2 data-focus:outline-offset-2 data-focus:outline-blue-500",
    variants: {
        $square: {
            true: "rounded-[20%]",
            false: "rounded-full",
        },
    },
});

type AvatarButtonProps = BaseAvatarProps &
    (Omit<Headless.ButtonProps, "className"> | Omit<React.ComponentPropsWithRef<typeof Link>, "className">) &
    VariantProps<typeof avatarButtonVariants> & {
        ref?: React.ForwardedRef<HTMLButtonElement>;
    };

export function AvatarButton({ ref, $square = false, src, initials, alt, className, ...props }: AvatarButtonProps) {
    return "href" in props ? (
        <Link
            {...props}
            className={avatarButtonVariants({
                $square,
                className,
            })}
            ref={ref as React.ForwardedRef<HTMLAnchorElement>}
        >
            <TouchTarget>
                <Avatar $square={$square} alt={alt} initials={initials} src={src} />
            </TouchTarget>
        </Link>
    ) : (
        <Headless.Button
            {...props}
            className={avatarButtonVariants({
                $square,
                className,
            })}
            ref={ref}
        >
            <TouchTarget>
                <Avatar $square={$square} alt={alt} initials={initials} src={src} />
            </TouchTarget>
        </Headless.Button>
    );
}
