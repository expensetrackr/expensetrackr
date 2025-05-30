import { router } from "@inertiajs/react";
import mitt from "mitt";
import {
    renderQueryString,
    type unstable_AdapterOptions as AdapterOptions,
    unstable_createAdapterProvider as createAdapterProvider,
    type unstable_AdapterInterface as AdapterInterface,
} from "nuqs/adapters/custom";
import * as React from "react";

const emitter = mitt<{ update: URLSearchParams }>();

function createInertiaBasedAdapter() {
    function useNuqsInertiaBasedAdapter(): AdapterInterface {
        const searchParams = useOptimisticSearchParams();
        const updateUrl = React.useCallback((search: URLSearchParams, options: AdapterOptions) => {
            React.startTransition(() => {
                emitter.emit("update", search);
            });
            const url = new URL(location.href);
            url.search = renderQueryString(search);
            // First, update the URL locally without triggering a network request,
            // this allows keeping a reactive URL if the network is slow.
            const updateMethod = options.history === "push" ? history.pushState : history.replaceState;
            updateMethod.call(history, history.state, "", url.toString());

            if (options.shallow === false) {
                router.visit(url, {
                    replace: true,
                    preserveScroll: true,
                    preserveState: true,
                });
            }

            if (options.scroll) {
                window.scrollTo(0, 0);
            }
        }, []);
        return {
            searchParams,
            updateUrl,
        };
    }

    function useOptimisticSearchParams() {
        const [searchParams, setSearchParams] = React.useState(() => {
            // Since useSearchParams isn't reactive to shallow changes,
            // it doesn't pick up changes in the URL on mount, so we need to initialise
            // the reactive state with the current URL instead.
            if (typeof location === "undefined") {
                // We use this on the server to SSR with the correct search params.
                return new URLSearchParams();
            }
            return new URLSearchParams(location.search);
        });

        React.useEffect(() => {
            function onPopState() {
                setSearchParams(new URLSearchParams(location.search));
            }
            function onEmitterUpdate(search: URLSearchParams) {
                setSearchParams(search);
            }
            emitter.on("update", onEmitterUpdate);
            window.addEventListener("popstate", onPopState);
            return () => {
                emitter.off("update", onEmitterUpdate);
                window.removeEventListener("popstate", onPopState);
            };
        }, []);

        return searchParams;
    }

    return {
        NuqsAdapter: createAdapterProvider(useNuqsInertiaBasedAdapter),
        useOptimisticSearchParams,
    };
}

export const { NuqsAdapter, useOptimisticSearchParams } = createInertiaBasedAdapter();
