import * as Headless from "@headlessui/react";
import type { VariantProps } from "cva";
import * as React from "react";

import type { Nullable, User } from "#/types";
import { cva, cx } from "#/utils/cva";
import { TouchTarget } from "./button";
import { Link } from "./link";

const avatarVariants = cva({
	base: [
		// Basic layout
		"inline-grid shrink-0 align-middle [--avatar-radius:20%] [--ring-opacity:20%] *:col-start-1 *:row-start-1",
	],
	variants: {
		$square: {
			true: "rounded-[var(--avatar-radius)] *:rounded-[var(--avatar-radius)]",
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
					className="select-none bg-blue-200 fill-blue-950 text-label-md uppercase"
					viewBox="0 0 100 100"
					aria-hidden={alt ? undefined : "true"}
				>
					{alt && <title>{alt}</title>}
					<text
						x="50%"
						y="50%"
						alignmentBaseline="middle"
						dominantBaseline="middle"
						textAnchor="middle"
						dy=".125em"
						className="text-[48px]"
					>
						{initials}
					</text>
				</svg>
			)}
			{src && <img {...imageProps} className={cx(imageProps?.className, "rounded-full")} src={src} alt={alt} />}
		</span>
	);
}

const avatarButtonVariants = cva({
	base: "relative focus:outline-none data-[focus]:outline data-[focus]:outline-2 data-[focus]:outline-blue-500 data-[focus]:outline-offset-2",
	variants: {
		$square: {
			true: "rounded-[20%]",
			false: "rounded-full",
		},
	},
});

type AvatarButtonProps = BaseAvatarProps &
	(Omit<Headless.ButtonProps, "className"> | Omit<React.ComponentPropsWithoutRef<typeof Link>, "className">) &
	VariantProps<typeof avatarButtonVariants>;

export const AvatarButton = React.forwardRef(function AvatarButton(
	{ $square = false, src, initials, alt, className, ...props }: AvatarButtonProps,
	ref: React.ForwardedRef<HTMLElement>,
) {
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
				<Avatar src={src} $square={$square} initials={initials} alt={alt} />
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
				<Avatar src={src} $square={$square} initials={initials} alt={alt} />
			</TouchTarget>
		</Headless.Button>
	);
});
