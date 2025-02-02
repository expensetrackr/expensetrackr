import CupIcon from "virtual:icons/ri/cup-line";
import HomeSmileFillIcon from "virtual:icons/ri/home-smile-fill";
import LightbulbFlashFillIcon from "virtual:icons/ri/lightbulb-flash-fill";
import PieChartIcon from "virtual:icons/ri/pie-chart-line";
import PlaneIcon from "virtual:icons/ri/plane-line";
import RestaurantIcon from "virtual:icons/ri/restaurant-line";
import ShoppingCartIcon from "virtual:icons/ri/shopping-cart-line";
import TicketIcon from "virtual:icons/ri/ticket-line";

export type Transaction = {
    id: string;
    type: "other" | "rent" | "tax" | "phone" | "internet" | "donate" | "electricity" | "gas" | "water";
    name: string;
    description: string;
    transaction: number;
    date: Date;
    icon: React.ElementType | string;
};

export type TypeVirtualCard = {
    type: "virtual";
    id: string;
    status: "active" | "inactive";
    name: string;
    balance: number;
    cardNumber: string;
    expiryDate: string;
    cvc: string;
    logo: string;
    limit: number;
    recentTransactions: Transaction[];
};

export type TypePhysicalCard = {
    type: "physical";
    id: string;
    name: string;
    balance: number;
    cardNumber: string;
    expiryDate: string;
    cvc: string;
    logo: string;
    limit: number;
    recentTransactions: Transaction[];
};

export const virtualCardsData: TypeVirtualCard[] = [
    {
        type: "virtual",
        id: "savings-card",
        status: "active",
        name: "Savings Card",
        balance: 16058.94,
        cardNumber: "• • • • 1234",
        expiryDate: "06/27",
        cvc: "• • •",
        logo: "apex",
        limit: 12000.0,
        recentTransactions: [
            {
                id: "2441c347",
                type: "other",
                name: "Stock Dividend",
                description: "Payment from stock investments.",
                transaction: 1500,
                date: new Date("09/15/2024"),
                icon: PieChartIcon,
            },
            {
                id: "ab193fd6",
                type: "rent",
                name: "Rental Income",
                description: "Rental payment from Mr. Dudley.",
                transaction: 800,
                date: new Date("09/17/2024"),
                icon: HomeSmileFillIcon,
            },
            {
                id: "7a2dc594",
                type: "other",
                name: "Grocery Shopping",
                description: "Purchase of monthly groceries.",
                transaction: -84.14,
                date: new Date("09/16/2024"),
                icon: ShoppingCartIcon,
            },
        ],
    },
    {
        type: "virtual",
        id: "daily-spending-card",
        status: "inactive",
        name: "Daily Spending Card",
        balance: 11.25,
        cardNumber: "• • • • 6454",
        expiryDate: "11/29",
        cvc: "• • •",
        logo: "solaris",
        limit: 675.0,
        recentTransactions: [
            {
                id: "f869c5a7",
                type: "other",
                name: "Netflix Cashback",
                description: "Cashback of September, 2023",
                transaction: 36.24,
                date: new Date("09/15/2024"),
                icon: "/images/major-brands/netflix.svg",
            },
            {
                id: "789d6ef4",
                type: "electricity",
                name: "Electricity Bills",
                description: "Payment for electricity bills.",
                transaction: -72.32,
                date: new Date("09/17/2024"),
                icon: LightbulbFlashFillIcon,
            },
            {
                id: "d1f9a9e8",
                type: "other",
                name: "Coffee Shop",
                description: "Purchase at local coffee shop.",
                transaction: -4.75,
                date: new Date("09/18/2024"),
                icon: CupIcon,
            },
        ],
    },
];

export const physicalCardsData: TypePhysicalCard[] = [
    {
        type: "physical",
        id: "travel-card",
        name: "Travel Card",
        balance: 453.76,
        cardNumber: "• • • • 9876",
        expiryDate: "12/25",
        cvc: "• • •",
        logo: "voyage",
        limit: 1000.0,
        recentTransactions: [
            {
                id: "b2a7e6d5",
                type: "other",
                name: "Flight Booking",
                description: "Flight reservation to New York.",
                transaction: -350.0,
                date: new Date("09/14/2024"),
                icon: PlaneIcon,
            },
            {
                id: "d3b5c8a4",
                type: "other",
                name: "Restaurant Dinner",
                description: "Dinner at a restaurant.",
                transaction: -45.2,
                date: new Date("09/16/2024"),
                icon: RestaurantIcon,
            },
            {
                id: "e4f6d7c8",
                type: "other",
                name: "Movie Tickets",
                description: "Tickets for a movie screening.",
                transaction: -25.5,
                date: new Date("09/17/2024"),
                icon: TicketIcon,
            },
        ],
    },
];
