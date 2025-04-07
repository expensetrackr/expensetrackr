export interface Trend {
    current: string;
    previous: string | null;
    favorableDirection: "up" | "down";
    percentageChange: string;
}
