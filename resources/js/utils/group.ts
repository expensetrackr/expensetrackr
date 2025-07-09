export function groupBy<K extends keyof T & PropertyKey, T>(
    items: Iterable<T>,
    keySelector: K,
): Partial<Record<T[K] & PropertyKey, T[]>>;

export function groupBy<K extends PropertyKey, T>(
    items: Iterable<T>,
    keySelector: (item: T, index: number) => K,
): Partial<Record<K, T[]>>;

export function groupBy<K extends PropertyKey, T>(
    items: Iterable<T>,
    keySelector: keyof T | ((item: T, index: number) => K),
): Partial<Record<K, T[]>> {
    const result = {} as Partial<Record<K, T[]>>;

    const isFunction = typeof keySelector === "function";

    let index = 0;
    for (const item of items) {
        const key = isFunction
            ? (keySelector as (item: T, index: number) => K)(item, index)
            : (item[keySelector as keyof T] as unknown as K);

        if (typeof key !== "string" && typeof key !== "number" && typeof key !== "symbol") {
            throw new Error("Key must be a string, number, or symbol");
        }

        if (!result[key]) {
            result[key] = [];
        }

        result[key]!.push(item);
        index++;
    }

    return result;
}
