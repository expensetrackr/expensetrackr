export const currencyFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
});

export const compactNumFormatter = new Intl.NumberFormat("en-US", {
    notation: "compact",
    compactDisplay: "short",
});
