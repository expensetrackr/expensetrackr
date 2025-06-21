import ArrowLeftRightIcon from "virtual:icons/hugeicons/arrow-left-right";
import BankIcon from "virtual:icons/hugeicons/bank";
import MoreHorizontalCircle01Icon from "virtual:icons/hugeicons/more-horizontal-circle-01";
import ShoppingBasket03Icon from "virtual:icons/hugeicons/shopping-basket-03";
import Wallet05Icon from "virtual:icons/hugeicons/wallet-05";

export const classificationIcons: Record<
    App.Enums.Finance.CategoryClassification,
    React.ComponentType<React.SVGProps<SVGSVGElement>>
> = {
    income: Wallet05Icon,
    expense: ShoppingBasket03Icon,
    transfer: ArrowLeftRightIcon,
    savings: BankIcon,
    other: MoreHorizontalCircle01Icon,
};

export function CategoryClassificationIcon({
    classification,
    ...props
}: { classification: App.Enums.Finance.CategoryClassification } & React.SVGProps<SVGSVGElement>) {
    const Icon = classificationIcons[classification];

    return <Icon {...props} />;
}
