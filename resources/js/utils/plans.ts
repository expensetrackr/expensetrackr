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
            monthly: {
                price: 11.99,
                previous: 19.99,
                savings: "40%",
            },
            yearly: {
                price: 99.99,
                previous: 189.99,
                savings: "47%",
            },
        },
        productPriceId: {
            monthly: "2b006aff-cf3b-4237-a4ff-2bb79cd0e802",
            yearly: "af6336b0-c292-42b7-897c-3ab770c53594",
        },
        buttonLabel: "Subscribe now",
        glowColor: "var(--color-primary)",
        buyNow: {
            monthly: "https://buy.polar.sh/polar_cl_3rpOu2DpnOjk7tEwZDy3QFZD35c2TDZqGJOp42TKql6",
            yearly: "https://buy.polar.sh/polar_cl_gkwfnwL0mTl2mZRzHmRpp6b3tRVL0MdkB6EM00ircKS",
        },
    },
    {
        code: "lifetime",
        icon: BrainFillIcon,
        iconBg: "bg-state-feature-base",
        price: {
            onetime: {
                price: 299.99,
                previous: 549.99,
                savings: "45%",
            },
        },
        productPriceId: "be41d3b8-14c9-4b8d-bee8-64633a54da42",
        glowColor: "var(--color-state-feature-base)",
        buyNow: "https://buy.polar.sh/polar_cl_MX3laEezVBa2fto7mIAlaNmRja2b83iCufGU80q47ar",
    },
];
