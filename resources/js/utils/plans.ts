import Medal06Icon from "virtual:icons/hugeicons/medal-06";
import PieChart02Icon from "virtual:icons/hugeicons/pie-chart-02";
import PiggyBankIcon from "virtual:icons/hugeicons/piggy-bank";

export const plans = [
    {
        code: "free",
        icon: Medal06Icon,
        iconBg: "bg-state-faded-base",
        glowColor: "var(--color-state-faded-base)",
    },
    {
        code: "personal",
        icon: PieChart02Icon,
        iconBg: "bg-primary",
        isFeatured: true,
        isSubscription: true,
        price: {
            monthly: {
                price: 11.99,
                previous: 19.99,
                savings: "40%",
            },
            yearly: {
                price: 8.33,
                previous: 15.99,
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
        icon: PiggyBankIcon,
        iconBg: "bg-state-feature-base",
        price: {
            onetime: {
                price: 99.99,
                previous: 299.99,
                savings: "45%",
            },
        },
        productPriceId: "be41d3b8-14c9-4b8d-bee8-64633a54da42",
        glowColor: "var(--color-state-feature-base)",
        buyNow: "https://buy.polar.sh/polar_cl_MX3laEezVBa2fto7mIAlaNmRja2b83iCufGU80q47ar",
    },
];
