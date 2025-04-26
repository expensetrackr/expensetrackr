import { routes } from "#/routes.ts";
import { Link } from "./link.tsx";
import Logo from "./logo.tsx";
import * as LinkButton from "./ui/link-button.tsx";

const links = [
    {
        title: "Resources",
        links: [
            { label: "Help", href: "/help" },
            { label: "Changelog", href: "/changelog" },
            { label: "Blog", href: "/blog" },
            { label: "Contact", href: "/contact" },
        ],
    },
    {
        title: "Socials",
        links: [
            { label: "Discord", href: "https://discord.gg/" },
            { label: "X", href: "https://x.com/expensetrackapp" },
        ],
    },
    {
        title: "Legal",
        links: [
            {
                label: "Privacy Policy",
                href: routes.policy.show.url(),
            },
            {
                label: "Terms of Service",
                href: routes.terms.show.url(),
            },
        ],
    },
];

export function Footer() {
    return (
        <footer className="relative overflow-hidden">
            <div className="container border-x border-t bg-(--bg-white-0) py-12 lg:px-12">
                <div className="grid grid-cols-1 gap-y-8 sm:grid-cols-2 lg:col-span-4 lg:grid-cols-4">
                    <div className="lg:pr-8">
                        <Logo className="h-6 w-auto" />
                        <p className="mt-2 text-paragraph-xs font-medium text-(--text-sub-600)">
                            © {new Date().getFullYear()} ExpenseTrackr
                        </p>
                    </div>

                    {links.map((section, index) => (
                        <div className="before:bg-(--white-0)" key={index}>
                            <h3 className="font-medium">{section.title}</h3>

                            <nav className="mt-4" role="navigation">
                                <ul className="space-y-2" role="list">
                                    {section.links.map((link) => (
                                        <li key={link.href}>
                                            <LinkButton.Root
                                                aria-label={link.label}
                                                asChild
                                                className="text-paragraph-sm font-medium"
                                                title={`link to ${link.label}`}
                                            >
                                                <Link href={link.href}>{link.label}</Link>
                                            </LinkButton.Root>
                                        </li>
                                    ))}
                                </ul>
                            </nav>
                        </div>
                    ))}
                </div>
            </div>
        </footer>
    );
}
