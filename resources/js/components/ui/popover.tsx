import * as PopoverPrimitive from "@radix-ui/react-popover";
import { Slottable } from "@radix-ui/react-slot";

import { cnMerge } from "#/utils/cn.ts";

const PopoverRoot = PopoverPrimitive.Root;
const PopoverTrigger = PopoverPrimitive.Trigger;
const PopoverAnchor = PopoverPrimitive.Anchor;

function PopoverContent({
    children,
    className,
    align = "center",
    sideOffset = 12,
    collisionPadding = 12,
    arrowPadding = 12,
    showArrow = true,
    unstyled,
    ...rest
}: React.CustomComponentPropsWithRef<typeof PopoverPrimitive.Content> & {
    showArrow?: boolean;
    unstyled?: boolean;
}) {
    return (
        <PopoverPrimitive.Portal>
            <PopoverPrimitive.Content
                align={align}
                arrowPadding={arrowPadding}
                className={cnMerge(
                    // base
                    [
                        !unstyled &&
                            "w-max rounded-16 bg-(--bg-white-0) p-5 shadow-md ring-1 ring-(--stroke-soft-200) ring-inset",
                    ],
                    "z-50",
                    // animation
                    "data-[state=closed]:animate-out data-[state=open]:animate-in",
                    "data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
                    "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
                    className,
                )}
                collisionPadding={collisionPadding}
                sideOffset={sideOffset}
                {...rest}
            >
                <Slottable>{children}</Slottable>
                {showArrow && (
                    <PopoverPrimitive.Arrow asChild>
                        <div className="size-[11px] -translate-y-[calc(50%+1px)] -rotate-45 rounded-bl-[3px] border border-(--stroke-soft-200) bg-(--bg-white-0) [clip-path:polygon(0_100%,0_0,100%_100%)]"></div>
                    </PopoverPrimitive.Arrow>
                )}
            </PopoverPrimitive.Content>
        </PopoverPrimitive.Portal>
    );
}
PopoverContent.displayName = "PopoverContent";

function PopoverClose({
    className,
    unstyled,
    ...rest
}: React.CustomComponentPropsWithRef<typeof PopoverPrimitive.Close> & {
    unstyled?: boolean;
}) {
    return <PopoverPrimitive.Close className={cnMerge([!unstyled && "absolute top-4 right-4"], className)} {...rest} />;
}
PopoverClose.displayName = "PopoverClose";

export {
    PopoverRoot as Root,
    PopoverAnchor as Anchor,
    PopoverTrigger as Trigger,
    PopoverContent as Content,
    PopoverClose as Close,
};
