import { router, usePage } from "@inertiajs/react";
import { useEffect, useState } from "react";

const isClient = typeof window !== "undefined";
const isServer = !isClient;

export function useQueryParams<T extends Record<string, unknown> = Record<string, unknown>>(): T {
	const initial = isClient ? queryParams() : {};
	const [state, setState] = useState<T>(initial as T);

	if (isServer) {
		return usePage<{ query: T }>().props.query;
	}

	const updateState = () => {
		const newState = queryParams();
		setState((prev) => ({ ...prev, ...newState }));
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies: not exhaustive
	useEffect(() => {
		updateState();
		return router.on("finish", () => {
			updateState();
		});
	}, []);
	return state;
}
