import * as DialogPrimitive from "@radix-ui/react-dialog";
import * as React from "react";
import CloseIcon from "virtual:icons/ri/close-line";

import * as CompactButton from "#/components/ui/compact-button.tsx";
import { cnMerge } from "#/utils/cn.ts";

const DrawerRoot = DialogPrimitive.Root;
DrawerRoot.displayName = "Drawer";

const DrawerTrigger = DialogPrimitive.Trigger;
DrawerTrigger.displayName = "DrawerTrigger";

const DrawerClose = DialogPrimitive.Close;
DrawerClose.displayName = "DrawerClose";

const DrawerPortal = DialogPrimitive.Portal;
DrawerPortal.displayName = "DrawerPortal";

function DrawerOverlay({ className, ...rest }: React.CustomComponentPropsWithRef<typeof DialogPrimitive.Overlay>) {
    return (
        <DialogPrimitive.Overlay
            className={cnMerge(
                // base
                "fixed inset-0 z-50 grid grid-cols-1 place-items-end overflow-hidden bg-overlay backdrop-blur-[10px]",
                // animation
                "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0",
                className,
            )}
            {...rest}
        />
    );
}
DrawerOverlay.displayName = "DrawerOverlay";

function DrawerContent({
    className,
    children,
    ...rest
}: React.CustomComponentPropsWithRef<typeof DialogPrimitive.Content>) {
    return (
        <DrawerPortal>
            <DrawerOverlay>
                <DialogPrimitive.Content
                    className={cnMerge(
                        // base
                        "size-full max-w-[400px] overflow-y-auto",
                        "border-l border-(--stroke-soft-200) bg-(--bg-white-0)",
                        // animation
                        "data-[state=open]:duration-200 data-[state=open]:ease-out data-[state=open]:animate-in",
                        "data-[state=closed]:duration-200 data-[state=closed]:ease-in data-[state=closed]:animate-out",
                        "data-[state=open]:slide-in-from-right-full",
                        "data-[state=closed]:slide-out-to-right-full",
                        className,
                    )}
                    {...rest}
                >
                    <div className="relative flex size-full flex-col">{children}</div>
                </DialogPrimitive.Content>
            </DrawerOverlay>
        </DrawerPortal>
    );
}
DrawerContent.displayName = "DrawerContent";

function DrawerHeader({
    className,
    children,
    showCloseButton = true,
    ...rest
}: React.HTMLAttributes<HTMLDivElement> & {
    showCloseButton?: boolean;
}) {
    return (
        <div className={cnMerge("flex items-center gap-3 border-(--stroke-soft-200) p-5", className)} {...rest}>
            {children}

            {showCloseButton && (
                <DrawerClose asChild>
                    <CompactButton.Root $size="lg" $style="ghost">
                        <CompactButton.Icon as={CloseIcon} />
                    </CompactButton.Root>
                </DrawerClose>
            )}
        </div>
    );
}
DrawerHeader.displayName = "DrawerHeader";

function DrawerTitle({ className, ...rest }: React.CustomComponentPropsWithRef<typeof DialogPrimitive.Title>) {
    return (
        <DialogPrimitive.Title
            className={cnMerge("flex-1 text-label-lg text-(--text-strong-950)", className)}
            {...rest}
        />
    );
}
DrawerTitle.displayName = "DrawerTitle";

function DrawerBody({ className, children, ...rest }: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div className={cnMerge("flex-1", className)} {...rest}>
            {children}
        </div>
    );
}
DrawerBody.displayName = "DrawerBody";

function DrawerFooter({ className, ...rest }: React.HTMLAttributes<HTMLDivElement>) {
    return <div className={cnMerge("flex items-center gap-4 border-(--stroke-soft-200) p-5", className)} {...rest} />;
}
DrawerFooter.displayName = "DrawerFooter";

export {
    DrawerRoot as Root,
    DrawerTrigger as Trigger,
    DrawerClose as Close,
    DrawerContent as Content,
    DrawerHeader as Header,
    DrawerTitle as Title,
    DrawerBody as Body,
    DrawerFooter as Footer,
};
