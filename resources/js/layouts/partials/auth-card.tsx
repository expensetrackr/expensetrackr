import * as Divider from "#/components/ui/divider.tsx";
import { cn } from "#/utils/cn.ts";

type AuthCardProps = {
    children: React.ReactNode;
    cardIcon?: React.ForwardRefExoticComponent<React.SVGProps<SVGSVGElement>>;
    title?: string;
    description?: string;
};

export function AuthCard({ children, cardIcon: CardIcon, title, description }: AuthCardProps) {
    return (
        <div className="w-full max-w-[472px] px-4">
            <div className="flex w-full flex-col gap-6 rounded-20 bg-(--bg-white-0) p-5 ring-1 shadow-xs ring-(--stroke-soft-200) ring-inset md:p-8">
                {CardIcon || title || description ? (
                    <div className="flex flex-col items-center gap-2">
                        {/* icon */}
                        {CardIcon ? (
                            <div
                                className={cn(
                                    "relative flex size-[68px] shrink-0 items-center justify-center rounded-full backdrop-blur-xl lg:size-24",
                                    // bg
                                    "before:absolute before:inset-0 before:rounded-full",
                                    "before:bg-gradient-to-b before:from-neutral-500 before:to-transparent before:opacity-10",
                                )}
                            >
                                <div className="relative z-10 flex size-12 items-center justify-center rounded-full bg-(--bg-white-0) ring-1 shadow-xs ring-(--stroke-soft-200) ring-inset lg:size-16">
                                    <CardIcon className="size-6 text-(--text-sub-600) lg:size-8" />
                                </div>
                            </div>
                        ) : null}

                        {title || description ? (
                            <div className="space-y-1 text-center">
                                {title ? <div className="text-h6 lg:text-h5">{title}</div> : null}
                                {description ? (
                                    <div className="text-paragraph-sm text-(--text-sub-600) lg:text-paragraph-md">
                                        {description}
                                    </div>
                                ) : null}
                            </div>
                        ) : null}
                    </div>
                ) : null}

                <Divider.Root />

                {children}
            </div>
        </div>
    );
}
