import { Link as InertiaLink, usePage } from "@inertiajs/react";

export function Link({ ...props }: React.ComponentPropsWithRef<typeof InertiaLink>) {
    const { url } = usePage();

    const pathname = props.href.startsWith("/") ? props.href : new URL(props.href).pathname;

    return <InertiaLink aria-current={url.split("?")[0] === pathname ? "page" : undefined} {...props} />;
}
