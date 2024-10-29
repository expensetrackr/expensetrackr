import { router } from "@inertiajs/react";
import { renderQueryString, type unstable_AdapterOptions, unstable_createAdapterProvider } from "nuqs/adapters/custom";
import { useState } from "react";

function useNuqsInertiaAdapter() {
	const [searchParams, setSearchParams] = useState(() => {
		if (typeof location === "undefined") {
			return new URLSearchParams();
		}
		return new URLSearchParams(location.search);
	});

	const updateUrl = (search: URLSearchParams, options: unstable_AdapterOptions) => {
		const url = new URL(window.location.href);
		url.search = renderQueryString(search);

		router.visit(url, {
			replace: options.history === "replace",
			preserveScroll: !options.scroll,
		});
	};

	return {
		searchParams,
		updateUrl,
	};
}

export const NuqsAdapter = unstable_createAdapterProvider(useNuqsInertiaAdapter);
