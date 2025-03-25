import MoreHorizontalCircle01Icon from "virtual:icons/hugeicons/more-horizontal-circle-01";
import RepeatIcon from "virtual:icons/hugeicons/repeat";
import ShoppingBasket03Icon from "virtual:icons/hugeicons/shopping-basket-03";
import Wallet02Icon from "virtual:icons/hugeicons/wallet-02";

export const classificationIcons: Record<
    App.Enums.CategoryClassification,
    React.ComponentType<React.SVGProps<SVGSVGElement>>
> = {
    income: Wallet02Icon,
    expense: ShoppingBasket03Icon,
    transfer: RepeatIcon,
    other: MoreHorizontalCircle01Icon,
};

export function CategoryClassificationIcon({
    classification,
    ...props
}: { classification: App.Enums.CategoryClassification } & React.SVGProps<SVGSVGElement>) {
    const Icon = classificationIcons[classification];

    return <Icon {...props} />;
}
