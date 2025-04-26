import { type ButtonRootProps } from "#/components/ui/button.tsx";

type Plan = {
    code: string;
    img: string;
    isFeatured?: boolean;
    price: {
        monthly: number | null;
        yearly: number | null;
        onetime: number | null;
    };
    productPriceId: {
        monthly: string | null;
        yearly: string | null;
        onetime: string | null;
    };
    buttonStyle: ButtonRootProps["$style"];
    buttonType: ButtonRootProps["$type"];
};

export const plans: Plan[] = [
    {
        code: "personal",
        img: "/img/personal-plan.png",
        price: {
            monthly: 14.99,
            yearly: 8.33,
            onetime: null,
        },
        productPriceId: {
            monthly: "42d54e49-6f94-4e90-a137-e850d38ee5c7",
            yearly: "88978e70-3cae-479f-a6f9-d6864205b020",
            onetime: null,
        },
        buttonStyle: "stroke",
        buttonType: "primary",
    },
    {
        code: "lifetime",
        img: "/img/lifetime-plan.png",
        isFeatured: true,
        price: {
            monthly: null,
            yearly: null,
            onetime: 269.99,
        },
        productPriceId: {
            monthly: null,
            yearly: null,
            onetime: "c969cccd-95cc-4c0c-b7a4-721a61d63e4b",
        },
        buttonStyle: "filled",
        buttonType: "neutral",
    },
    {
        code: "enterprise",
        img: "/img/enterprise-plan.png",
        price: {
            monthly: null,
            yearly: null,
            onetime: null,
        },
        productPriceId: {
            monthly: null,
            yearly: null,
            onetime: null,
        },
        buttonStyle: "lighter",
        buttonType: "primary",
    },
];
