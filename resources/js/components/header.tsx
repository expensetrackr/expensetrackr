import { useScroll } from "#/hooks/use-scroll.ts";
import { routes } from "#/routes.ts";
import { cn } from "#/utils/cn.ts";
import { Link } from "./link.tsx";
import Logo from "./logo.tsx";
import * as Button from "./ui/button.tsx";
import * as LinkButton from "./ui/link-button.tsx";

const navItems = [
    {
        label: "Home",
        href: routes.home.url(),
    },
    {
        label: "Features",
        href: "/#features",
    },
    {
        label: "Pricing",
        href: "/#pricing",
    },
];

export function Header() {
    const { scrollY } = useScroll();
    return (
        <div
            className={cn(
                "fixed top-0 left-0 z-50 flex w-full items-center justify-center px-2 transition-all duration-300 lg:inset-x-0 lg:px-0",
                scrollY > 64 ? "h-16 lg:bg-(--bg-white-0)/80 lg:shadow-sm lg:backdrop-blur-sm" : "h-16 lg:h-20",
            )}
        >
            <div
                className={cn(
                    "container mx-px flex items-center justify-between border border-t-0 bg-(--bg-white-0) transition-all duration-300 ring-inset lg:mx-0 lg:border-0 lg:bg-transparent",
                    scrollY > 64 ? "h-16" : "h-16 lg:h-20",
                )}
            >
                <div className="flex flex-row items-center justify-between">
                    <Link href="/">
                        <span className="sr-only">Go to homepage</span>
                        <Logo className="h-8 w-auto" />
                    </Link>
                </div>

                <div className="flex items-center gap-10">
                    <ul className="hidden items-center gap-10 lg:flex">
                        {navItems.map((item) => (
                            <li key={item.href}>
                                <LinkButton.Root asChild>
                                    <Link href={item.href}>{item.label}</Link>
                                </LinkButton.Root>
                            </li>
                        ))}
                    </ul>

                    <Button.Root asChild>
                        <Link href={routes.register.url()}>Get started now</Link>
                    </Button.Root>
                </div>
            </div>
        </div>
    );
}
