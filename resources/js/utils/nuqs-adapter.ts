import { router } from "@inertiajs/react";
import mitt from "mitt";
import { renderQueryString, type unstable_AdapterOptions, unstable_createAdapterProvider } from "nuqs/adapters/custom";
import * as React from "react";

const emitter = mitt<{ update: URLSearchParams }>();

function updateUrl(search: URLSearchParams, options: unstable_AdapterOptions) {
    const url = new URL(window.location.href);
    url.search = renderQueryString(search);
    router.visit(url, {
        replace: options.history === "replace",
        preserveScroll: !options.scroll,
        preserveState: options.shallow,
    });
    emitter.emit("update", search);
}

function useNuqsInertiaAdapter() {
    const [searchParams, setSearchParams] = React.useState(() => {
        if (typeof location === "undefined") {
            return new URLSearchParams();
        }
        return new URLSearchParams(location.search);
    });

    React.useEffect(() => {
        // Popstate event is only fired when the user navigates
        // via the browser's back/forward buttons.
        const onPopState = () => {
            setSearchParams(new URLSearchParams(location.search));
        };
        emitter.on("update", setSearchParams);
        window.addEventListener("popstate", onPopState);
        return () => {
            emitter.off("update", setSearchParams);
            window.removeEventListener("popstate", onPopState);
        };
    }, []);

    return {
        searchParams,
        updateUrl,
    };
}

export const NuqsAdapter = unstable_createAdapterProvider(useNuqsInertiaAdapter);
