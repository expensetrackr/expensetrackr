import { routes } from "#/routes.ts";
import { Link } from "./link.tsx";
import Logo from "./logo.tsx";
import * as LinkButton from "./ui/link-button.tsx";

const links = [
    {
        title: "Resources",
        links: [
            {
                label: "Help",
                href: "mailto:support@expensetrackr.app?subject=ExpenseTrackr%20Support%20Request%20-%20[Briefly%20describe%20your%20issue]&body=Hello%20ExpenseTrackr%20Support%2C%0A%0AI%20am%20writing%20regarding%20an%20issue%20or%20question%20about%20ExpenseTrackr.%0A%0APlease%20provide%20details%20about%20your%20issue%20below%3A%0A%0A%5BDescribe%20your%20issue%20in%20detail%2C%20including%20what%20you%20were%20trying%20to%20do%2C%20what%20happened%2C%20and%20any%20error%20messages%5D%0A%0A--------------------%0ADevice%20%26%20Operating%20System%3A%20%5Be.g.%2C%20Windows%2010%2C%20macOS%2C%20iOS%2C%20Android%5D%0ABrowser%20(if%20using%20web%20app)%3A%20%5Be.g.%2C%20Chrome%2C%20Firefox%2C%20Safari%5D%0AExpenseTrackr%20Version%20(if%20applicable)%3A%20%5Be.g.%2C%20v1.2.3%5D%0A--------------------%0A%0AThank%20you%2C%0A%5BYour%20Name%5D",
            },
            { label: "Changelog", href: routes.changelog.index.url() },
            {
                label: "Contact",
                href: "mailto:hello@expensetrackr.app?subject=General%20Inquiry%20About%20ExpenseTrackr&body=Hello%2C%0A%0AI%20have%20a%20general%20inquiry%20regarding%20ExpenseTrackr.%0A%0APlease%20provide%20details%20about%20your%20inquiry%20below%3A%0A%0A%5BInsert%20your%20message%20here%5D%0A%0AThank%20you%2C%0A%5BYour%20Name%5D",
            },
        ],
    },
    {
        title: "Socials",
        links: [
            { label: "Discord", href: "https://discord.gg/zDVy7RK4Z6" },
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
                                                {link.href.startsWith("mailto:") ? (
                                                    <a href={link.href} rel="noopener noreferrer" target="_blank">
                                                        {link.label}
                                                    </a>
                                                ) : (
                                                    <Link href={link.href}>{link.label}</Link>
                                                )}
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
