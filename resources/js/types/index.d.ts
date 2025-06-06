export interface Trend {
    current: number;
    previous: number | null;
    favorableDirection: "up" | "down";
    percentageChange: string;
}
