import BarChartBoxAiFillIcon from "virtual:icons/ri/bar-chart-box-ai-fill";
import BrainFillIcon from "virtual:icons/ri/brain-fill";
import MedalFillIcon from "virtual:icons/ri/medal-fill";

export const plans = [
    {
        code: "free",
        icon: MedalFillIcon,
        iconBg: "bg-state-faded-base",
        glowColor: "var(--color-state-faded-base)",
    },
    {
        code: "analyst",
        icon: BarChartBoxAiFillIcon,
        iconBg: "bg-primary",
        featured: true,
        price: {
            monthly: 14.99,
            yearly: 149.99,
        },
        productPriceId: {
            monthly: "2b006aff-cf3b-4237-a4ff-2bb79cd0e802",
            yearly: "af6336b0-c292-42b7-897c-3ab770c53594",
        },
        buttonLabel: "Subscribe now",
        glowColor: "var(--color-primary)",
    },
    {
        code: "lifetime",
        icon: BrainFillIcon,
        iconBg: "bg-state-feature-base",
        price: {
            onetime: 249.99,
        },
        productPriceId: "be41d3b8-14c9-4b8d-bee8-64633a54da42",
        glowColor: "var(--color-state-feature-base)",
    },
];
