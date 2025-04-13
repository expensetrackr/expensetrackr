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
            monthly: "42d54e49-6f94-4e90-a137-e850d38ee5c7",
            yearly: "88978e70-3cae-479f-a6f9-d6864205b020",
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
        productPriceId: "c969cccd-95cc-4c0c-b7a4-721a61d63e4b",
        glowColor: "var(--color-state-feature-base)",
        buyNow: "https://buy.polar.sh/polar_cl_MX3laEezVBa2fto7mIAlaNmRja2b83iCufGU80q47ar",
    },
];
